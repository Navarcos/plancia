package helm

import (
	"context"
	"errors"
	"github.com/activadigital/plancia/configs/logger"
	"github.com/activadigital/plancia/internal/domain/apperror"
	"github.com/activadigital/plancia/internal/domain/types"
	"go.uber.org/zap"
	"helm.sh/helm/v3/pkg/action"
	"helm.sh/helm/v3/pkg/chart"
	"helm.sh/helm/v3/pkg/chart/loader"
	"helm.sh/helm/v3/pkg/cli"
	"helm.sh/helm/v3/pkg/release"
	"helm.sh/helm/v3/pkg/storage/driver"
	"k8s.io/cli-runtime/pkg/genericclioptions"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
	"k8s.io/utils/ptr"
	"time"
)

func Install(ctx context.Context, kubeconfig []byte, repoUrl string, release *types.HelmRelease, timeout time.Duration) error {
	settings := cli.New()
	actionConfig, err := getActionConfig(ctx, kubeconfig, release.Namespace)
	if err != nil {
		return err
	}
	chrt, err := loadChart(repoUrl, settings, release.Chart, release.Version)
	if err != nil {
		return err
	}
	releaseName := release.Release
	histClient := action.NewHistory(actionConfig)
	histClient.Max = 1
	if _, err = histClient.Run(releaseName); errors.Is(err, driver.ErrReleaseNotFound) {
		install := action.NewInstall(actionConfig)
		install.ReleaseName = releaseName
		install.Namespace = release.Namespace
		install.CreateNamespace = true
		install.Wait = true
		install.Timeout = timeout

		_, err = install.Run(chrt, release.Values)
		if err != nil {
			return err
		}
		return nil
	}
	return upgradeRelease(actionConfig, chrt, release)
}

func List(ctx context.Context, kubeconfig []byte, namespace string) ([]*release.Release, error) {
	actionConfig, err := getActionConfig(ctx, kubeconfig, namespace)
	if err != nil {
		return nil, err
	}
	list := action.NewList(actionConfig)
	list.AllNamespaces = true
	list.All = true
	list.Short = true
	result, err := list.Run()
	if err != nil {
		return nil, err
	}
	return result, nil
}

func upgradeRelease(actionConfig *action.Configuration, chrt *chart.Chart, release *types.HelmRelease) error {
	upgrade := action.NewUpgrade(actionConfig)
	upgrade.Namespace = release.Namespace
	upgrade.Wait = true
	upgrade.Timeout = 30 * time.Minute

	_, err := upgrade.Run(release.Release, chrt, release.Values)
	if err != nil {
		return err
	}
	return nil
}

func loadChart(repoUrl string, settings *cli.EnvSettings, chartName, version string) (*chart.Chart, error) {
	chartPathOptions := action.ChartPathOptions{
		RepoURL: repoUrl,
		Version: version,
	}
	chartPath, err := chartPathOptions.LocateChart(chartName, settings)
	if err != nil {
		return nil, err
	}

	chrt, err := loader.Load(chartPath)
	if err != nil {
		return nil, err
	}
	return chrt, nil
}

func getActionConfig(ctx context.Context, kubeconfig []byte, namespace string) (*action.Configuration, error) {
	config, err := clientcmd.RESTConfigFromKubeConfig(kubeconfig)
	if err != nil {
		logger.Error(ctx, "error obtaining rest config", zap.Error(err))
		return nil, apperror.NewInternalError(err)
	}

	actionConfig := new(action.Configuration)
	cliConfig := genericclioptions.NewConfigFlags(false)
	cliConfig.APIServer = &config.Host
	cliConfig.BearerToken = &config.BearerToken
	cliConfig.Namespace = ptr.To("default")
	wrapper := func(*rest.Config) *rest.Config {
		return config
	}
	cliConfig.WithWrapConfigFn(wrapper)
	if err = actionConfig.Init(cliConfig, namespace, "secret", zap.S().Debugf); err != nil {
		return nil, err
	}
	return actionConfig, nil
}
