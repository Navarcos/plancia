package skafos

import (
	"context"
	"github.com/activadigital/plancia/configs/logger"
	"github.com/activadigital/plancia/internal/domain/apperror"
	"github.com/activadigital/plancia/internal/domain/port"
	"github.com/activadigital/plancia/internal/domain/skafos/client"
	"github.com/activadigital/plancia/internal/domain/skafos/manager"
	"github.com/activadigital/plancia/internal/domain/types"
	"go.uber.org/zap"
	"k8s.io/apimachinery/pkg/api/errors"
	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

type Cleaner interface {
	Clean(ctx context.Context, namespace, name string) error
}

type skafosCleaner struct {
	authClient    port.AuthInterface
	registry      client.SkafosRegistry
	skafosManager *manager.Manager
}

func NewSkafosCleaner(skafosManager *manager.Manager, registry client.SkafosRegistry, authClient port.AuthInterface) Cleaner {
	return &skafosCleaner{
		registry:      registry,
		authClient:    authClient,
		skafosManager: skafosManager,
	}
}

func (s skafosCleaner) Clean(ctx context.Context, namespace, name string) error {
	asyncCtx := context.WithoutCancel(ctx)
	err := s.authClient.DeleteAuthResources(asyncCtx, namespace, name)
	if err != nil {
		logger.Error(ctx, "error deleting skafos", zap.Error(err))
		return apperror.NewKubeError(err, apperror.Delete, "skafos", name)
	}
	s.deleteNamespaces(ctx, namespace, name)

	//Delete cluster obj in cluster manager
	err = s.skafosManager.Resource(types.ClusterGvr).Namespace(namespace).Delete(ctx, name, v1.DeleteOptions{})
	if err != nil {
		if errors.IsNotFound(err) {
			return nil
		}
		logger.Error(ctx, "error deleting skafos", zap.Error(err))
		return apperror.NewKubeError(err, apperror.Delete, "cluster", name)
	}
	return nil
}

func (s skafosCleaner) deleteNamespaces(ctx context.Context, namespace string, skafosName string) {
	skafosClient, err := s.registry.Get(ctx, namespace, skafosName)
	if err != nil {
		logger.Error(ctx, "error getting client")
		return
	}

	err = skafosClient.Dynamic().Resource(types.NamespaceGvr).DeleteCollection(ctx, v1.DeleteOptions{}, v1.ListOptions{})
	if err != nil {
		logger.Error(ctx, "error deleting namespaces")
		return
	}
}
