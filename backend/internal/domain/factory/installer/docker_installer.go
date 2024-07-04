package installer

import (
	"context"
	"github.com/activadigital/plancia/configs"
	"github.com/activadigital/plancia/configs/logger"
	"github.com/activadigital/plancia/internal/domain/skafos/client"
	"github.com/activadigital/plancia/internal/domain/skafos/helm"
	"github.com/activadigital/plancia/internal/domain/types"
	"go.uber.org/zap"
	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"time"
)

type dockerInstaller struct {
	registry client.SkafosRegistry
	timeout  time.Duration
}

func newDockerInstaller(registry client.SkafosRegistry, timeout time.Duration) DriverInstallationStrategy {
	return &dockerInstaller{
		registry: registry,
		timeout:  timeout,
	}
}

func (v *dockerInstaller) WithTimeout(timeout time.Duration) DriverInstallationStrategy {
	v.timeout = timeout
	return v
}

func (v *dockerInstaller) InstallDrivers(ctx context.Context, skafos types.Skafos) error {
	sClient, err := v.registry.Get(ctx, skafos.GetNamespace(), skafos.GetId())
	if err != nil {
		return err
	}
	err = v.installCalicoCrd(ctx, skafos, sClient)
	if err != nil {
		return err
	}
	err = v.setSecurityLabel(ctx, sClient)
	if err != nil {
		return err
	}

	err = v.installContainerNetworkInterface(ctx, sClient)
	if err != nil {
		return err
	}
	err = v.installMetricServer(ctx, skafos, sClient)
	if err != nil {
		return err
	}
	return nil
}

func (v *dockerInstaller) installCalicoCrd(ctx context.Context, skafos types.Skafos, sClient *client.SClient) error {
	crd := &types.HelmRelease{
		Chart:     tigCrdChart,
		Version:   tigeraVersion,
		Release:   tigCrdRelease,
		Namespace: tigeraNs,
		Values:    map[string]interface{}{},
	}
	err := helm.Install(ctx, sClient.GetKubeconfig(), configs.Global().HelmRepoUrl, crd, v.timeout)
	if err != nil {
		logger.Error(ctx, "error installing chart", zap.Error(err))
		return err
	}
	return nil
}

func (v *dockerInstaller) installContainerNetworkInterface(ctx context.Context, sClient *client.SClient) error {
	cni := &types.HelmRelease{
		Chart:     tigOpChart,
		Version:   tigeraVersion,
		Release:   tigOpRelease,
		Namespace: tigeraNs,
		Values:    map[string]interface{}{},
	}
	err := helm.Install(ctx, sClient.GetKubeconfig(), configs.Global().HelmRepoUrl, cni, v.timeout)
	if err != nil {
		logger.Error(ctx, "error installing chart", zap.Error(err))
		return err
	}
	return nil
}

func (v *dockerInstaller) installMetricServer(ctx context.Context, skafos types.Skafos, sClient *client.SClient) error {
	cni := &types.HelmRelease{
		Chart:     metricServerChart,
		Version:   metricServerVersion,
		Release:   metricServerRelease,
		Namespace: metricServerNs,
		Values:    map[string]interface{}{},
	}
	err := helm.Install(ctx, sClient.GetKubeconfig(), configs.Global().HelmRepoUrl, cni, v.timeout)
	if err != nil {
		logger.Error(ctx, "error installing chart", zap.Error(err))
		return err
	}
	return nil
}

func (v *dockerInstaller) setSecurityLabel(ctx context.Context, sClient *client.SClient) error {
	namespace, err := sClient.ClientSet().CoreV1().Namespaces().Get(ctx, tigeraNs, v1.GetOptions{})
	if err != nil {
		return err
	}
	namespace.SetLabels(map[string]string{
		"pod-security.kubernetes.io/enforce": "privileged",
		"pod-security.kubernetes.io/warn":    "privileged",
		"pod-security.kubernetes.io/audit":   "privileged",
	})
	_, err = sClient.ClientSet().CoreV1().Namespaces().Update(ctx, namespace, v1.UpdateOptions{})
	if err != nil {
		return err
	}
	return nil
}
