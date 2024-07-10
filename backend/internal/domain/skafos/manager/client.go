package manager

import (
	"context"
	"fmt"
	"github.com/activadigital/plancia/internal/domain/factory/builder"
	"github.com/activadigital/plancia/internal/domain/types"
	"k8s.io/apimachinery/pkg/apis/meta/v1/unstructured"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/apimachinery/pkg/runtime/schema"
	"k8s.io/client-go/discovery"
	memory "k8s.io/client-go/discovery/cached"
	"k8s.io/client-go/dynamic"
	"k8s.io/client-go/dynamic/dynamicinformer"
	"k8s.io/client-go/informers"
	"k8s.io/client-go/restmapper"
	"k8s.io/client-go/tools/cache"
	"sigs.k8s.io/cluster-api/api/v1beta1"
	expv1beta1 "sigs.k8s.io/cluster-api/exp/api/v1beta1"
	"time"
)

const (
	defaultResync        = 10 * time.Minute
	namespaceIndexerName = "namespace"
	clusterIndexerName   = "clusterName"
)

type Manager struct {
	dynamic.Interface
	*restmapper.DeferredDiscoveryRESTMapper
	dynamicinformer.DynamicSharedInformerFactory
	informers map[schema.GroupVersionResource]informers.GenericInformer
}

func New(dynClient dynamic.Interface, discoveryClient discovery.DiscoveryInterface) *Manager {
	factory := dynamicinformer.NewDynamicSharedInformerFactory(dynClient, defaultResync)
	mapper := restmapper.NewDeferredDiscoveryRESTMapper(memory.NewMemCacheClient(discoveryClient))
	return &Manager{dynClient, mapper, factory, internalInformer(factory)}
}

func internalInformer(factory dynamicinformer.DynamicSharedInformerFactory) map[schema.GroupVersionResource]informers.GenericInformer {
	clusterInformer := factory.ForResource(types.ClusterGvr)
	_ = clusterInformer.Informer().AddIndexers(map[string]cache.IndexFunc{namespaceIndexerName: namespaceIndexer})

	controlPlaneInformer := factory.ForResource(types.ControlPlaneGvr)

	machineDeployInformer := factory.ForResource(types.MachineDeployGvr)
	_ = machineDeployInformer.Informer().AddIndexers(map[string]cache.IndexFunc{clusterIndexerName: mdClusterNameIndexer})

	vSphereMachineTemplateInf := factory.ForResource(types.VSphereMachineTemplateGvr)

	machinePoolInformer := factory.ForResource(types.MachinePoolGvr)
	_ = machinePoolInformer.Informer().AddIndexers(map[string]cache.IndexFunc{clusterIndexerName: mpClusterNameIndexer})

	informerMap := make(map[schema.GroupVersionResource]informers.GenericInformer, 5)
	informerMap[types.ClusterGvr] = clusterInformer
	informerMap[types.ControlPlaneGvr] = controlPlaneInformer
	informerMap[types.MachineDeployGvr] = machineDeployInformer
	informerMap[types.VSphereMachineTemplateGvr] = vSphereMachineTemplateInf
	informerMap[types.MachinePoolGvr] = machinePoolInformer
	return informerMap
}

func namespaceIndexer(obj interface{}) ([]string, error) {
	unstructuredCluster := obj.(*unstructured.Unstructured)
	return []string{unstructuredCluster.GetNamespace()}, nil
}

func mdClusterNameIndexer(obj interface{}) ([]string, error) {
	unstructuredMd := obj.(*unstructured.Unstructured)
	md := &v1beta1.MachineDeployment{}
	err := runtime.DefaultUnstructuredConverter.FromUnstructured(unstructuredMd.UnstructuredContent(), md)
	if err != nil {
		return nil, err
	}
	return []string{md.Spec.ClusterName}, nil
}

func mpClusterNameIndexer(obj interface{}) ([]string, error) {
	unstructuredMp := obj.(*unstructured.Unstructured)
	mp := &expv1beta1.MachinePool{}
	err := runtime.DefaultUnstructuredConverter.FromUnstructured(unstructuredMp.UnstructuredContent(), mp)
	if err != nil {
		return nil, err
	}
	return []string{mp.Spec.ClusterName}, nil
}

func (i *Manager) List(ctx context.Context) ([]types.Skafos, error) {
	clusterInterfaces := i.informers[types.ClusterGvr].Informer().GetIndexer().List()
	result := make([]types.Skafos, 0, len(clusterInterfaces))
	for _, clusterInterface := range clusterInterfaces {
		skafos, err := i.buildSkafos(ctx, clusterInterface)
		if err != nil {
			return nil, err
		}
		result = append(result, skafos)
	}
	return result, nil
}

func (i *Manager) buildSkafos(ctx context.Context, clusterInterface interface{}) (types.Skafos, error) {
	unstructuredCluster := clusterInterface.(*unstructured.Unstructured)
	cluster := &v1beta1.Cluster{}
	err := runtime.DefaultUnstructuredConverter.FromUnstructured(unstructuredCluster.UnstructuredContent(), cluster)
	if err != nil {
		return nil, err
	}
	provider, err := getProvider(cluster)
	if err != nil {
		return nil, err
	}
	return builder.Builder(provider, i.informers).Build(ctx, cluster)
}

func getProvider(cluster *v1beta1.Cluster) (types.Provider, error) {
	labelValue := cluster.GetLabels()[types.ProviderLabel]
	return types.ProviderFromValue(labelValue)
}

func (i *Manager) ListByNamespace(ctx context.Context, namespace string) ([]types.Skafos, error) {
	clusterInterfaces, err := i.informers[types.ClusterGvr].Informer().GetIndexer().ByIndex(namespaceIndexerName, namespace)
	if err != nil {
		return nil, err
	}
	result := make([]types.Skafos, 0, len(clusterInterfaces))
	for _, clusterInterface := range clusterInterfaces {
		skafos, err := i.buildSkafos(ctx, clusterInterface)
		if err != nil {
			return nil, err
		}
		result = append(result, skafos)
	}
	return result, nil
}

func (i *Manager) GetVsphereSkafos(ctx context.Context, name string, namespace string) (*types.VsphereSkafos, error) {
	cluster, err := i.getCluster(ctx, name, namespace)
	if err != nil {
		return nil, err
	}
	skafos, err := builder.Builder(types.Vsphere, i.informers).Build(ctx, cluster)
	if err != nil {
		return nil, err
	}
	return skafos.(*types.VsphereSkafos), nil
}

func (i *Manager) GetDockerSkafos(ctx context.Context, name string, namespace string) (*types.DockerSkafos, error) {
	cluster, err := i.getCluster(ctx, name, namespace)
	if err != nil {
		return nil, err
	}
	skafos, err := builder.Builder(types.Docker, i.informers).Build(ctx, cluster)
	if err != nil {
		return nil, err
	}
	return skafos.(*types.DockerSkafos), nil
}

func (i *Manager) getCluster(ctx context.Context, name string, namespace string) (*v1beta1.Cluster, error) {
	key := fmt.Sprintf("%s/%s", namespace, name)
	clusterInterface, exists, err := i.informers[types.ClusterGvr].Informer().GetIndexer().GetByKey(key)
	if err != nil {
		return nil, err
	}
	if !exists {
		return nil, fmt.Errorf("not found")
	}
	unstructuredCluster := clusterInterface.(*unstructured.Unstructured)
	cluster := &v1beta1.Cluster{}
	err = runtime.DefaultUnstructuredConverter.FromUnstructured(unstructuredCluster.UnstructuredContent(), cluster)
	if err != nil {
		return nil, err
	}
	return cluster, nil
}
