package skafos

import (
	"context"
	"errors"
	"github.com/activadigital/plancia/configs/logger"
	"github.com/activadigital/plancia/internal/api/dtos"
	"github.com/activadigital/plancia/internal/domain/apperror"
	"github.com/activadigital/plancia/internal/domain/skafos/client"
	"github.com/activadigital/plancia/internal/domain/skafos/manager"
	"github.com/activadigital/plancia/internal/domain/types"
	"go.uber.org/zap"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/apis/meta/v1/unstructured"
	"k8s.io/client-go/kubernetes"
	"k8s.io/utils/ptr"
)

type Getter interface {
	GetSkafosList(ctx context.Context, namespace string) ([]types.Skafos, error)
	GetVsphereSkafos(ctx context.Context, namespace, name string) (*types.VsphereSkafos, error)
	GetKubeconfig(ctx context.Context, namespace, name string) ([]byte, error)
	ApiDiscovery(ctx context.Context, namespace, name string) ([]*metav1.APIResourceList, error)
	GetSkafosStats(ctx context.Context, name string, namespace string) (*dtos.ResourceOverview, error)
	GetDockerSkafos(ctx context.Context, name string, namespace string) (*types.DockerSkafos, error)
	GetExternalClusters(ctx context.Context, namespace string) (*unstructured.UnstructuredList, error)
}

type skafosGetter struct {
	skafosManager *manager.Manager
	registry      client.SkafosRegistry
}

func NewSkafosListGetter(skafosManager *manager.Manager, registry client.SkafosRegistry) Getter {
	return &skafosGetter{
		skafosManager: skafosManager,
		registry:      registry,
	}
}

func (getter *skafosGetter) GetSkafosList(ctx context.Context, namespace string) ([]types.Skafos, error) {
	if namespace != "" {
		return getter.getSkafosListByNamespace(ctx, namespace)
	}
	return getter.getSkafosList(ctx)
}

func (getter *skafosGetter) getSkafosList(ctx context.Context) ([]types.Skafos, error) {
	skafosList, err := getter.skafosManager.List(ctx)
	if err != nil {
		logger.Error(ctx, "error getting skafosList", zap.Error(err))
		return nil, apperror.NewKubeError(err, apperror.List, "skafos", "")
	}
	return skafosList, nil
}

func (getter *skafosGetter) GetExternalClusters(ctx context.Context, namespace string) (*unstructured.UnstructuredList, error) {
	secrets, err := getter.skafosManager.Resource(types.SecretGvr).Namespace(namespace).List(ctx, metav1.ListOptions{
		LabelSelector: types.SkafosLabel + "=false",
	})
	if err != nil {
		return nil, err
	}
	return secrets, nil
}

func (getter *skafosGetter) getSkafosListByNamespace(ctx context.Context, namespace string) ([]types.Skafos, error) {
	skafosList, err := getter.skafosManager.ListByNamespace(ctx, namespace)
	if err != nil {
		logger.Error(ctx, "error getting skafosList", zap.Error(err),
			zap.String("namespace", namespace))
		return nil, apperror.NewKubeError(err, apperror.List, "skafos", "")
	}
	return skafosList, nil
}

func (getter *skafosGetter) GetVsphereSkafos(ctx context.Context, name string, namespace string) (*types.VsphereSkafos, error) {
	vsphereSkafos, err := getter.skafosManager.GetVsphereSkafos(ctx, name, namespace)
	if err != nil {
		logger.Error(ctx, "error getting skafos", zap.Error(err),
			zap.String("namespace", namespace), zap.String("name", name))
		notFoundErr := &apperror.NotFoundError{}
		if errors.As(err, notFoundErr) {
			return nil, err
		}
		return nil, apperror.NewKubeError(err, apperror.List, "skafos", name)
	}
	return vsphereSkafos, nil
}

func (getter *skafosGetter) GetDockerSkafos(ctx context.Context, name string, namespace string) (*types.DockerSkafos, error) {
	dockerSkafos, err := getter.skafosManager.GetDockerSkafos(ctx, name, namespace)
	if err != nil {
		logger.Error(ctx, "error getting skafos", zap.Error(err),
			zap.String("namespace", namespace), zap.String("name", name))
		return nil, apperror.NewKubeError(err, apperror.List, "skafos", name)
	}
	return dockerSkafos, nil
}

func (getter *skafosGetter) GetSkafosStats(ctx context.Context, namespace string, name string) (*dtos.ResourceOverview, error) {
	skafosClient, err := getter.registry.Get(ctx, namespace, name)
	if err != nil {
		logger.Error(ctx, "error getting skafos client", zap.Error(err))
		return nil, apperror.NewClientInstantiationError(err, namespace, name)
	}
	podChan := make(chan dtos.PodStats)
	go getter.getPodStats(ctx, skafosClient.ClientSet(), podChan)
	deployChan := make(chan dtos.ResourceStats)
	go getter.getDeploymentStats(ctx, skafosClient.ClientSet(), deployChan)
	sfsChan := make(chan dtos.ResourceStats)
	go getter.getStatefulSetStats(ctx, skafosClient.ClientSet(), sfsChan)
	replicaChan := make(chan dtos.ResourceStats)
	go getter.getReplicaSetStats(ctx, skafosClient.ClientSet(), replicaChan)

	podStats := <-podChan
	deployStats := <-deployChan
	sfsStats := <-sfsChan
	replicaStats := <-replicaChan

	stats := &dtos.ResourceOverview{
		PodStats:         podStats,
		DeploymentStats:  deployStats,
		StatefulSetStats: sfsStats,
		ReplicaSetStats:  replicaStats,
	}
	return stats, nil
}

func (getter *skafosGetter) getPodStats(ctx context.Context, clientset kubernetes.Interface, podChan chan dtos.PodStats) {
	defer close(podChan)
	stats := dtos.PodStats{}
	podList, err := clientset.CoreV1().Pods(metav1.NamespaceAll).List(ctx, metav1.ListOptions{
		TimeoutSeconds: ptr.To[int64](2),
	})
	if err != nil {
		podChan <- stats
		return
	}
	for _, pod := range podList.Items {
		stats.IncrementPhase(pod)
	}
	podChan <- stats
}

func (getter *skafosGetter) getDeploymentStats(ctx context.Context, clientset kubernetes.Interface, deployChan chan dtos.ResourceStats) {
	defer close(deployChan)
	stats := dtos.ResourceStats{}
	deploymentList, err := clientset.AppsV1().Deployments(metav1.NamespaceAll).List(ctx, metav1.ListOptions{
		TimeoutSeconds: ptr.To[int64](2),
	})
	if err != nil {
		deployChan <- stats
		return
	}
	for _, deploy := range deploymentList.Items {
		stats.IncrementDeploy(deploy)
	}
	deployChan <- stats
}

func (getter *skafosGetter) getStatefulSetStats(ctx context.Context, clientset kubernetes.Interface, sfsChan chan dtos.ResourceStats) {
	defer close(sfsChan)

	stats := dtos.ResourceStats{}
	statefulSetList, err := clientset.AppsV1().StatefulSets(metav1.NamespaceAll).List(ctx, metav1.ListOptions{
		TimeoutSeconds: ptr.To[int64](2),
	})
	if err != nil {
		sfsChan <- stats
		return
	}
	for _, statefulSet := range statefulSetList.Items {
		stats.IncrementStatefulSet(statefulSet)
	}
	sfsChan <- stats
}

func (getter *skafosGetter) getReplicaSetStats(ctx context.Context, clientset kubernetes.Interface, replicaChan chan dtos.ResourceStats) {
	stats := dtos.ResourceStats{}
	defer close(replicaChan)

	replicaSetList, err := clientset.AppsV1().ReplicaSets(metav1.NamespaceAll).List(ctx, metav1.ListOptions{
		TimeoutSeconds: ptr.To[int64](2),
	})
	if err != nil {
		replicaChan <- stats
		return
	}
	for _, replicaSet := range replicaSetList.Items {
		stats.IncrementReplicaSet(replicaSet)
	}
	replicaChan <- stats
}

func (getter *skafosGetter) GetKubeconfig(ctx context.Context, namespace, name string) ([]byte, error) {
	skafos, err := getter.registry.Get(ctx, namespace, name)
	if err != nil {
		logger.Error(ctx, "error getting kubeconfig", zap.Error(err))
		return nil, apperror.NewClientInstantiationError(err, namespace, name)
	}
	return skafos.GetKubeconfig(), nil
}

func (getter *skafosGetter) ApiDiscovery(ctx context.Context, namespace, name string) ([]*metav1.APIResourceList, error) {
	skafos, err := getter.registry.Get(ctx, namespace, name)
	if err != nil {
		logger.Error(ctx, "error api discovery", zap.Error(err))
		return nil, apperror.NewClientInstantiationError(err, namespace, name)
	}
	resources, err := skafos.Discovery().ServerPreferredResources()
	if err != nil {
		logger.Error(ctx, "error api discovery", zap.Error(err))
		return nil, apperror.NewKubeError(err, apperror.List, "api-discovery", "")
	}
	return resources, nil
}
