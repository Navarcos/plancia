package installer

import (
	"context"
	"encoding/json"
	"github.com/activadigital/plancia/configs"
	"github.com/activadigital/plancia/configs/logger"
	"github.com/activadigital/plancia/internal/adapters/manifest/file"
	"github.com/activadigital/plancia/internal/domain/skafos/client"
	"github.com/activadigital/plancia/internal/domain/skafos/helm"
	"github.com/activadigital/plancia/internal/domain/types"
	"go.uber.org/zap"
	"gopkg.in/yaml.v3"
	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/apis/meta/v1/unstructured"
	kyaml "k8s.io/apimachinery/pkg/runtime/serializer/yaml"
	ktypes "k8s.io/apimachinery/pkg/types"
	memory "k8s.io/client-go/discovery/cached"
	"k8s.io/client-go/restmapper"
	"k8s.io/utils/ptr"
	"time"
)

const (
	systemNamespace = "kube-system"
	cpiChart        = "vsphere-cpi-navarcos"
	cpiRelease      = "vsphere-cpi"
	cpiVersion      = "1.26.0"

	metricServerChart   = "metrics-server"
	metricServerRelease = "metrics-server"
	metricServerNs      = "kube-system"
	metricServerVersion = "3.11.0"

	tigCrdChart   = "tigera-crds-navarcos"
	tigCrdRelease = "calico-crds"

	tigOpChart    = "tigera-operator-navarcos"
	tigOpRelease  = "calico"
	tigeraVersion = "3.26.4"
	tigeraNs      = "tigera-operator"

	csiVersion = "3.0.1"
	csiChart   = "vsphere-csi-navarcos"
	csiRelease = "vsphere-csi"
	csiNs      = "vmware-system-csi"
)

type vsphereInstaller struct {
	registry client.SkafosRegistry
	timeout  time.Duration
}

func newVsphereInstaller(registry client.SkafosRegistry, timeout time.Duration) DriverInstallationStrategy {
	return &vsphereInstaller{
		registry: registry,
		timeout:  timeout,
	}
}

func (v *vsphereInstaller) WithTimeout(timeout time.Duration) DriverInstallationStrategy {
	v.timeout = timeout
	return v
}

func (v *vsphereInstaller) InstallDrivers(ctx context.Context, skafos types.Skafos) error {
	sClient, err := v.registry.Get(ctx, skafos.GetNamespace(), skafos.GetId())
	if err != nil {
		return err
	}
	err = v.installCloudProviderInterface(ctx, skafos, sClient)
	if err != nil {
		return err
	}
	err = v.installContainerNetworkInterface(ctx, sClient)
	if err != nil {
		return err
	}
	err = v.installContainerStorageInterface(ctx, skafos, sClient)
	if err != nil {
		return err
	}
	err = v.installStorageClass(ctx, skafos, sClient)
	if err != nil {
		return err
	}
	return nil
}

func (v *vsphereInstaller) installCloudProviderInterface(ctx context.Context, skafos types.Skafos, sClient *client.SClient) error {
	manifest, err := file.GetManifest(ctx, file.CpiValuesPath, skafos.GetData())
	if err != nil {
		return err
	}
	values := map[string]interface{}{}
	err = yaml.Unmarshal([]byte(manifest), values)
	if err != nil {
		logger.Error(ctx, "error unmarshal cpi values", zap.Error(err))
		return err
	}
	cpi := &types.HelmRelease{
		Chart:     cpiChart,
		Version:   cpiVersion,
		Release:   cpiRelease,
		Namespace: systemNamespace,
		Values:    values,
	}
	err = helm.Install(ctx, sClient.GetKubeconfig(), configs.Global().HelmRepoUrl, cpi, v.timeout)
	if err != nil {
		logger.Error(ctx, "error installing chart", zap.Error(err))
		return err
	}
	return nil
}

func (v *vsphereInstaller) installContainerNetworkInterface(ctx context.Context, sClient *client.SClient) error {
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

func (v *vsphereInstaller) installContainerStorageInterface(ctx context.Context, skafos types.Skafos, sClient *client.SClient) error {
	manifest, err := file.GetManifest(ctx, file.CsiValuesPath, skafos.GetData())
	if err != nil {
		return err
	}
	values := map[string]interface{}{}
	err = yaml.Unmarshal([]byte(manifest), values)
	if err != nil {
		logger.Error(ctx, "error unmarshal csi values", zap.Error(err))
		return err
	}
	csi := &types.HelmRelease{
		Chart:     csiChart,
		Version:   csiVersion,
		Release:   csiRelease,
		Namespace: csiNs,
		Values:    values,
	}
	err = helm.Install(ctx, sClient.GetKubeconfig(), configs.Global().HelmRepoUrl, csi, v.timeout)
	if err != nil {
		logger.Error(ctx, "error installing chart", zap.Error(err))
		return err
	}
	return nil
}

func (v *vsphereInstaller) installStorageClass(ctx context.Context, skafos types.Skafos, sClient *client.SClient) error {
	manifest, err := file.GetManifest(ctx, file.StorageClassPath, skafos.GetData())
	if err != nil {
		return err
	}

	mapper := restmapper.NewDeferredDiscoveryRESTMapper(memory.NewMemCacheClient(sClient.Discovery()))

	obj := &unstructured.Unstructured{}
	_, gvk, err := decUnstructured.Decode([]byte(manifest), nil, obj)
	if err != nil {
		return err
	}

	mapping, err := mapper.RESTMapping(gvk.GroupKind(), gvk.Version)
	if err != nil {
		return err
	}

	data, err := json.Marshal(obj)
	if err != nil {
		return err
	}

	_, err = sClient.Dynamic().Resource(mapping.Resource).Patch(ctx, obj.GetName(), ktypes.ApplyPatchType, data, v1.PatchOptions{
		Force:        ptr.To(true),
		FieldManager: configs.Global().ServiceName,
	})
	if err != nil {
		return err
	}
	return nil
}

var decUnstructured = kyaml.NewDecodingSerializer(unstructured.UnstructuredJSONScheme)
