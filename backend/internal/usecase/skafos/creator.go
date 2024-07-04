package skafos

import (
	"context"
	"crypto/tls"
	"fmt"
	"github.com/activadigital/plancia/configs"
	"github.com/activadigital/plancia/configs/logger"
	"github.com/activadigital/plancia/internal/domain/apperror"
	"github.com/activadigital/plancia/internal/domain/factory/creator"
	"github.com/activadigital/plancia/internal/domain/factory/installer"
	"github.com/activadigital/plancia/internal/domain/port"
	"github.com/activadigital/plancia/internal/domain/skafos/client"
	"github.com/activadigital/plancia/internal/domain/skafos/manager"
	"github.com/activadigital/plancia/internal/domain/types"
	"go.uber.org/zap"
	"gopkg.in/yaml.v3"
	kv1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/api/errors"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"
	"net/http"
	"time"
)

const (
	pollingInterval = 10 * time.Second
)

type Creator interface {
	CreateSkafos(ctx context.Context, skafos types.Skafos) error
}

type skafosCreator struct {
	authClient       port.AuthInterface
	skafosManager    *manager.Manager
	creatorFactory   creator.CreationStrategyFactory
	installerFactory installer.DriverInstallationStrategyFactory
	registry         client.SkafosRegistry
}

func NewSkafosCreator(
	skafosManager *manager.Manager,
	creatorFactory creator.CreationStrategyFactory,
	auth port.AuthInterface,
	installerFactory installer.DriverInstallationStrategyFactory,
	registry client.SkafosRegistry,
) Creator {
	return &skafosCreator{
		authClient:       auth,
		creatorFactory:   creatorFactory,
		installerFactory: installerFactory,
		skafosManager:    skafosManager,
		registry:         registry,
	}
}

func (s *skafosCreator) CreateSkafos(ctx context.Context, skafos types.Skafos) error {
	conflict, err := s.checkConflict(ctx, skafos)
	if err != nil {
		logger.Error(ctx, "error creating skafos", zap.Error(err))
		return apperror.NewKubeError(err, apperror.Create, "skafos", skafos.GetName())
	}
	if conflict {
		return apperror.NewConflictError(fmt.Sprintf("skafos '%s' already exists", skafos.GetId()))
	}
	err = s.authClient.CreateAuthResources(ctx, skafos)
	if err != nil {
		logger.Error(ctx, "error creating skafos", zap.Error(err))
		return apperror.NewInternalError(err)
	}
	sCreator, err := s.creatorFactory.GetCreationStrategy(skafos.GetProvider().String())
	if err != nil {
		logger.Error(ctx, "error creating skafos", zap.Error(err))
		return err
	}
	err = sCreator.Create(ctx, skafos)
	if err != nil {
		logger.Error(ctx, "error creating skafos", zap.Error(err))
		return apperror.NewInternalError(err)
	}
	asyncCtx := context.WithoutCancel(ctx)
	go s.setupCluster(asyncCtx, skafos)

	return nil
}

func (s *skafosCreator) checkConflict(ctx context.Context, skafos types.Skafos) (bool, error) {
	cluster, err := s.skafosManager.Resource(types.ClusterGvr).Namespace(skafos.GetNamespace()).Get(ctx, skafos.GetId(), metav1.GetOptions{})
	if err != nil {
		if errors.IsNotFound(err) {
			return false, nil
		}
		return false, err
	}
	return cluster != nil, nil
}

func (s *skafosCreator) setupCluster(ctx context.Context, skafos types.Skafos) {
	ctx, cancelFunc := context.WithTimeout(ctx, configs.Global().GetCreationTimeout())
	defer cancelFunc()

	err := s.waitForClusterReadiness(ctx, skafos)
	if err != nil {
		logger.Error(ctx, "error setup cluster", zap.Error(err))
		return
	}

	sInstaller, err := s.installerFactory.GetInstaller(skafos.GetProvider().String(), configs.Global().GetCreationTimeout())
	if err != nil {
		logger.Error(ctx, "error setup cluster", zap.Error(err))
		return
	}
	err = sInstaller.InstallDrivers(ctx, skafos)
	if err != nil {
		logger.Error(ctx, "error setup cluster", zap.Error(err))
		return
	}
}

func (s *skafosCreator) waitForClusterReadiness(ctx context.Context, skafos types.Skafos) error {
	for {
		select {
		case <-ctx.Done():
			return apperror.NewTimeoutError("create", "cluster", skafos.GetId())
		default:
			{
				kubeConfig, kubeconfigBytes, err := s.waitForKubeconfig(ctx, skafos)
				if err != nil {
					time.Sleep(pollingInterval)
					continue
				}
				_, err = s.registry.Set(ctx, skafos.GetNamespace(), skafos.GetId(), kubeconfigBytes)
				if err != nil {
					return err
				}
				apiServerUrl := getApiServerUrl(kubeConfig)
				err = waitApiServer(ctx, apiServerUrl, skafos.GetName())
				if err != nil {
					time.Sleep(pollingInterval)
					continue
				}
				return nil
			}
		}
	}
}

func getApiServerUrl(kubeConfig map[string]interface{}) string {
	return kubeConfig["clusters"].([]interface{})[0].(map[string]interface{})["cluster"].(map[string]interface{})["server"].(string)
}

func (s *skafosCreator) waitForKubeconfig(ctx context.Context, skafos types.Skafos) (map[string]interface{}, []byte, error) {
	name := fmt.Sprintf("%s-kubeconfig", skafos.GetId())
	uSecret, err := s.skafosManager.Resource(types.SecretGvr).Namespace(skafos.GetNamespace()).Get(ctx, name, metav1.GetOptions{})
	if err != nil {
		return nil, nil, err
	}
	secret := &kv1.Secret{}
	err = runtime.DefaultUnstructuredConverter.FromUnstructured(uSecret.UnstructuredContent(), secret)
	if err != nil {
		return nil, nil, err
	}
	kubeconfigBytes := secret.Data["value"]
	kubeConfig := map[string]interface{}{}
	err = yaml.Unmarshal(kubeconfigBytes, kubeConfig)
	if err != nil {
		return nil, nil, apperror.NewInternalError(err)
	}
	return kubeConfig, kubeconfigBytes, nil
}

func waitApiServer(ctx context.Context, apiServerUrl, name string) error {
	logger.Info(ctx, "waiting for apiServer...")
	err := ping(apiServerUrl)
	if err != nil {
		return err
	}
	return nil
}

func ping(url string) error {
	httpClient := http.Client{
		Transport: &http.Transport{
			TLSClientConfig: &tls.Config{
				InsecureSkipVerify: true,
			},
		},
		Timeout: 5 * time.Second,
	}
	_, err := httpClient.Get(url)
	return err
}
