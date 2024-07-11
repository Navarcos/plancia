package skafos

import (
	"context"
	"encoding/base64"
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
		logger.Debug(ctx, "error in check namespace", zap.Error(err))
		return err
	}

	secret := &v1.Secret{
		ObjectMeta: metav1.ObjectMeta{
			Name:      fmt.Sprintf("%s-kubeconfig", cluster.Name),
			Namespace: cluster.Namespace,
		},
		Data: map[string][]byte{
			"value": []byte(base64.StdEncoding.EncodeToString(cluster.Kubeconfig)),
		},
	}
	secret.SetLabels(map[string]string{
		types.ProviderLabel: cluster.Provider,
		types.SkafosLabel:   "false",
	})
	unstr, err := runtime.DefaultUnstructuredConverter.ToUnstructured(secret)
	if err != nil {
		return err
	}
	_, err = s.skafosManager.Resource(types.SecretGvr).Namespace(cluster.Namespace).
		Create(ctx, &unstructured.Unstructured{Object: unstr}, metav1.CreateOptions{})
	if err != nil {
		return err
	}
	_, err = s.clientRegistry.Set(ctx, cluster.Namespace, cluster.Name, cluster.Kubeconfig)
	if err != nil {
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
	if err != nil && errors.IsConflict(err) {
		return nil
	} else if err != nil {
		return err
	}
	return nil
}
