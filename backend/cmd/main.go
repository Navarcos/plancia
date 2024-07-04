// @title Plancia Api
// @version 1.0
// @description rest api for navarcos

// @host localhost:8080
// @BasePath /v1/api
package main

import (
	"context"
	"crypto/tls"
	"fmt"
	"github.com/Nerzal/gocloak/v13"
	"github.com/activadigital/plancia/configs"
	"github.com/activadigital/plancia/configs/logger"
	"github.com/activadigital/plancia/internal/adapters/auth/keycloak"
	"github.com/activadigital/plancia/internal/api/server"
	"github.com/activadigital/plancia/internal/domain/factory/creator"
	"github.com/activadigital/plancia/internal/domain/factory/installer"
	"github.com/activadigital/plancia/internal/domain/skafos/client"
	"github.com/activadigital/plancia/internal/domain/skafos/manager"
	"github.com/activadigital/plancia/internal/usecase"
	"github.com/activadigital/plancia/internal/usecase/skafos"
	"github.com/go-resty/resty/v2"
	"go.uber.org/zap"
	"k8s.io/client-go/discovery"
	"k8s.io/client-go/dynamic"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
	_ "net/http/pprof"
	"os"
	"time"
)

func main() {
	if err := Run(); err != nil {
		fmt.Printf("%s\n", err)
		os.Exit(1)
	}
	os.Exit(0)
}

func Run() error {
	//configuration
	ctx := context.Background()
	if err := configs.LoadConfig("configs", "config"); err != nil {
		return err
	}
	if err := logger.Init(configs.Global().Logger.Level); err != nil {
		return err
	}
	zap.S().Debug("configuration", configs.Global())

	restConfig, err := mainKubeconfig()
	if err != nil {
		return fmt.Errorf("get kubeconfig: %w", err)
	}
	err = instrumentKubeRestConfig(restConfig)
	if err != nil {
		return fmt.Errorf("instrument kubeClient: %w", err)
	}

	dynClient := dynamic.NewForConfigOrDie(restConfig)
	discoveryClient := discovery.NewDiscoveryClientForConfigOrDie(restConfig)
	skafosManager := manager.New(dynClient, discoveryClient)
	shutdown := make(chan struct{})
	skafosManager.WaitForCacheSync(shutdown)
	skafosManager.Start(shutdown)

	clientRegistry := client.NewClientRegistry(skafosManager)
	err = clientRegistry.Init(ctx)
	if err != nil {
		return err
	}

	//services
	gocloakClient := setupGocloakClient()
	keycloakAdapter := keycloak.NewKeycloakAdapter(gocloakClient)
	creatorFactory := creator.NewCreationStrategyFactory(skafosManager)
	installerFactory := installer.NewInstallerFactory(clientRegistry)

	skafosGetter := skafos.NewSkafosListGetter(skafosManager, clientRegistry)
	skafosCreator := skafos.NewSkafosCreator(skafosManager, creatorFactory, keycloakAdapter, installerFactory, clientRegistry)
	skafosPatcher := skafos.NewSkafosPatcher(skafosManager)
	skafosDeleter := skafos.NewSkafosCleaner(skafosManager, clientRegistry, keycloakAdapter)
	clusterUseCase := usecase.NewClusterUsecase(clientRegistry)

	app := server.NewApplication(
		skafosCreator, skafosGetter, skafosPatcher, skafosDeleter,
		clientRegistry, gocloakClient, clusterUseCase,
	)

	httpServer := app.Run(ctx)
	timeout := time.Duration(configs.Global().Server.Timeouts.Shutdown) * time.Second
	server.Shutdown(ctx, timeout, httpServer, skafosManager)
	return nil
}

func mainKubeconfig() (*rest.Config, error) {
	if configs.Global().ManagementCluster.Kubeconfig != "" {
		homedir, _ := os.UserHomeDir()
		pathKubeConfig := homedir + "/" + configs.Global().ManagementCluster.Kubeconfig
		return clientcmd.BuildConfigFromFlags("", pathKubeConfig)
	}
	return rest.InClusterConfig()
}

func instrumentKubeRestConfig(config *rest.Config) error {
	transportFor, err := rest.TransportFor(config)
	if err != nil {
		return err
	}
	roundTripper := client.NewLogger(transportFor)
	config.Transport = roundTripper
	config.TLSClientConfig = rest.TLSClientConfig{}
	return nil
}

func setupGocloakClient() *gocloak.GoCloak {
	authClient := gocloak.NewClient(
		configs.Global().Keycloak.Url,
	)
	restyClient := authClient.RestyClient()
	restyClient.SetRetryCount(3)
	restyClient.SetTimeout(5 * time.Second)
	restyClient.SetRootCertificateFromString(configs.Global().NavarcosCa)

	restyClient.SetTLSClientConfig(&tls.Config{
		InsecureSkipVerify: true,
	})
	restyClient.AddRetryCondition(func(response *resty.Response, err error) bool {
		return err != nil
	})
	defaultTransport := restyClient.GetClient().Transport
	restyClient.SetTransport(keycloak.NewLogger(defaultTransport))
	return authClient
}
