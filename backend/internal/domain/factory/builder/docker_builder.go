package builder

import (
	"context"
	"fmt"
	"github.com/activadigital/plancia/configs/logger"
	"github.com/activadigital/plancia/internal/domain/types"
	"go.uber.org/zap"
	"k8s.io/apimachinery/pkg/apis/meta/v1/unstructured"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/apimachinery/pkg/runtime/schema"
	"k8s.io/client-go/informers"
	"sigs.k8s.io/cluster-api/api/v1beta1"
	cpv1beta1 "sigs.k8s.io/cluster-api/controlplane/kubeadm/api/v1beta1"
	expv1beta1 "sigs.k8s.io/cluster-api/exp/api/v1beta1"
)

type DockerBuilder struct {
	informers map[schema.GroupVersionResource]informers.GenericInformer
}

func newDockerBuilder(informers map[schema.GroupVersionResource]informers.GenericInformer) BuilderStrategy {
	return &DockerBuilder{informers: informers}
}

func (d *DockerBuilder) Build(ctx context.Context, cluster *v1beta1.Cluster) (types.Skafos, error) {
	skafos := &types.DockerSkafos{
		Provider: types.Docker,
		Cluster:  cluster,
	}

	controlPlane, err := d.getControlPlane(ctx, skafos.Cluster)
	if err != nil {
		logger.Error(ctx, "control plane not found", zap.Error(err))
	}
	skafos.ControlPlane = controlPlane

	if err = d.addMachinePools(ctx, skafos); err != nil {
		logger.Error(ctx, "control plane not found", zap.Error(err))
	}
	return skafos, nil
}

func (d *DockerBuilder) getControlPlane(ctx context.Context, cluster *v1beta1.Cluster) (*cpv1beta1.KubeadmControlPlane, error) {
	cpKey := cluster.Spec.ControlPlaneRef.Namespace + "/" + cluster.Spec.ControlPlaneRef.Name
	cpInterface, exists, err := d.informers[types.ControlPlaneGvr].Informer().GetIndexer().GetByKey(cpKey)
	if err != nil {
		return nil, err
	}
	if !exists {
		return nil, fmt.Errorf("not found")
	}
	unstructuredCp := cpInterface.(*unstructured.Unstructured)
	cp := &cpv1beta1.KubeadmControlPlane{}
	err = runtime.DefaultUnstructuredConverter.FromUnstructured(unstructuredCp.UnstructuredContent(), cp)
	if err != nil {
		return nil, err
	}
	return cp, nil
}

func (d *DockerBuilder) addMachinePools(ctx context.Context, skafos *types.DockerSkafos) error {
	mpInterfaces, err := d.informers[types.MachinePoolGvr].Informer().GetIndexer().ByIndex(clusterIndexerName, skafos.Cluster.Name)
	if err != nil {
		return err
	}
	machinePools := []expv1beta1.MachinePool{}
	for _, mpInterface := range mpInterfaces {
		unstructuredMd := mpInterface.(*unstructured.Unstructured)
		mp := &expv1beta1.MachinePool{}
		err = runtime.DefaultUnstructuredConverter.FromUnstructured(unstructuredMd.UnstructuredContent(), mp)
		if err != nil {
			return err
		}
		machinePools = append(machinePools, *mp)
	}
	skafos.MachinePools = machinePools
	return nil
}
