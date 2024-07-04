package usecase

import (
	"context"
	"github.com/activadigital/plancia/configs/logger"
	"github.com/activadigital/plancia/internal/domain/skafos/client"
	"go.uber.org/zap"
)

type ClusterUsecase interface {
	ImportCluster(ctx context.Context, cluster []byte, provider, namespace, name string) error
}

type clusterUsecase struct {
	clientRegistry client.SkafosRegistry
	//resource       Resource
}

func NewClusterUsecase(clientRegistry client.SkafosRegistry) ClusterUsecase {
	return &clusterUsecase{
		clientRegistry: clientRegistry,
		//resource:       resource,
	}
}

func (s *clusterUsecase) ImportCluster(ctx context.Context, cluster []byte, provider, namespace, name string) error {
	if err := s.checkNamespace(ctx, namespace); err != nil {
		logger.Debug(ctx, "error in check namespace", zap.Error(err))
		return err
	}
	//skafosClient, err := s.clientRegistry.Get(ctx, namespace, name)
	//if err != nil {
	//	return err
	//}
	//data :=
	//secret, err := skafosClient.ClientSet().CoreV1().Secrets(namespace).Apply(ctx)
	//if err != nil {
	//	return err
	//}
	return nil
}

func (s *clusterUsecase) checkNamespace(ctx context.Context, namespace string) error {
	//n, err := s.resource.Get()
	//if err != nil {
	//	return err
	//}
	return nil
}
