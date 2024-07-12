package skafos

import (
	"context"
	"fmt"
	"github.com/activadigital/plancia/configs/logger"
	"github.com/activadigital/plancia/internal/domain/skafos/client"
	"github.com/activadigital/plancia/internal/domain/skafos/manager"
	"github.com/activadigital/plancia/internal/domain/types"
	"go.uber.org/zap"
	v1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/api/errors"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/apis/meta/v1/unstructured"
	"k8s.io/apimachinery/pkg/runtime"
)

type ClusterImporter interface {
	Import(ctx context.Context, cluster *types.ExternalCluster) error
}

type clusterImporter struct {
	clientRegistry client.SkafosRegistry
	skafosManager  *manager.Manager
}

func NewClusterImporter(skafosManager *manager.Manager, clientRegistry client.SkafosRegistry) ClusterImporter {
	return &clusterImporter{
		clientRegistry: clientRegistry,
		skafosManager:  skafosManager,
	}
}

func (s *clusterImporter) Import(ctx context.Context, cluster *types.ExternalCluster) error {
	if err := s.createNamespace(ctx, cluster.Namespace); err != nil {
		logger.Error(ctx, "error creating namespace", zap.Error(err))
		return err
	}

	secret := &v1.Secret{
		ObjectMeta: metav1.ObjectMeta{
			Name:      fmt.Sprintf("%s-kubeconfig", cluster.Name),
			Namespace: cluster.Namespace,
		},
		StringData: map[string]string{
			"value": cluster.Kubeconfig,
		},
	}
	secret.SetLabels(map[string]string{
		types.ProviderLabel: cluster.Provider,
		types.SkafosLabel:   "false",
	})
	unstr, err := runtime.DefaultUnstructuredConverter.ToUnstructured(secret)
	if err != nil {
		logger.Error(ctx, "error converting secret", zap.Error(err))
		return err
	}
	_, err = s.skafosManager.Resource(types.SecretGvr).Namespace(cluster.Namespace).
		Create(ctx, &unstructured.Unstructured{Object: unstr}, metav1.CreateOptions{})
	if err != nil {
		logger.Error(ctx, "error creating secret", zap.Error(err))
		return err
	}
	_, err = s.clientRegistry.Set(ctx, cluster.Namespace, cluster.GetId(), []byte(cluster.Kubeconfig))
	if err != nil {
		logger.Error(ctx, "error registering new client in registry", zap.Error(err))
		return err
	}
	return nil
}

func (s *clusterImporter) createNamespace(ctx context.Context, namespace string) error {
	n := &v1.Namespace{ObjectMeta: metav1.ObjectMeta{Name: namespace}}
	unstr, err := runtime.DefaultUnstructuredConverter.ToUnstructured(n)
	if err != nil {
		return err
	}
	_, err = s.skafosManager.Resource(types.NamespaceGvr).Create(ctx, &unstructured.Unstructured{Object: unstr}, metav1.CreateOptions{})
	if err != nil {
		if !errors.IsConflict(err) {
			return err
		}
	}
	return nil
}
