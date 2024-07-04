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
	v1beta12 "sigs.k8s.io/cluster-api-provider-vsphere/apis/v1beta1"
	"sigs.k8s.io/cluster-api/api/v1beta1"
	cpv1beta1 "sigs.k8s.io/cluster-api/controlplane/kubeadm/api/v1beta1"
)

const (
	clusterIndexerName = "clusterName"
)

type VSphereBuilder struct {
	informers map[schema.GroupVersionResource]informers.GenericInformer
}

func newVsphereBuilder(informers map[schema.GroupVersionResource]informers.GenericInformer) BuilderStrategy {
	return &VSphereBuilder{informers: informers}
}

func (v *VSphereBuilder) Build(ctx context.Context, cluster *v1beta1.Cluster) (types.Skafos, error) {
	skafos := &types.VsphereSkafos{
		Provider: types.Vsphere,
		Cluster:  cluster,
	}

	controlPlane, err := v.getControlPlane(ctx, skafos.Cluster)
	if err != nil {
		logger.Error(ctx, "control plane not found", zap.Error(err))
	}
	skafos.ControlPlane = controlPlane

	vmtName := controlPlane.Spec.MachineTemplate.InfrastructureRef.Name
	vsphereMachineTemplate, err := v.getVsphereMachineTemplate(ctx, vmtName, controlPlane.Namespace)
	if err != nil {
		logger.Error(ctx, "control plane not found", zap.Error(err))
	}
	skafos.ControlPlaneInfrastructure = vsphereMachineTemplate

	if err = v.addMachineDeployments(ctx, skafos); err != nil {
		logger.Error(ctx, "control plane not found", zap.Error(err))
	}
	return skafos, nil
}

func (v *VSphereBuilder) addMachineDeployments(ctx context.Context, skafos *types.VsphereSkafos) error {
	mdInterfaces, err := v.informers[types.MachineDeployGvr].Informer().GetIndexer().ByIndex(clusterIndexerName, skafos.Cluster.Name)
	if err != nil {
		return err
	}
	workerPools := make([]types.WorkerPool, 0, len(mdInterfaces))
	for _, mdInterface := range mdInterfaces {
		unstructuredMd := mdInterface.(*unstructured.Unstructured)
		md := &v1beta1.MachineDeployment{}
		err = runtime.DefaultUnstructuredConverter.FromUnstructured(unstructuredMd.UnstructuredContent(), md)
		if err != nil {
			return err
		}
		name := md.Spec.Template.Spec.InfrastructureRef.Name
		vsphereMachineTemplate, err := v.getVsphereMachineTemplate(ctx, name, md.Namespace)
		if err != nil {
			return err
		}
		workerPool := types.WorkerPool{
			MachineDeployment:               md,
			MachineDeploymentInfrastructure: vsphereMachineTemplate,
		}
		workerPools = append(workerPools, workerPool)
	}
	skafos.WorkerPools = workerPools
	return nil
}

func (v *VSphereBuilder) getControlPlane(ctx context.Context, cluster *v1beta1.Cluster) (*cpv1beta1.KubeadmControlPlane, error) {
	//todo controlPlaneRef
	cpKey := cluster.Namespace + "/" + fmt.Sprintf("%s-cp", cluster.Name)
	cpInterface, exists, err := v.informers[types.ControlPlaneGvr].Informer().GetIndexer().GetByKey(cpKey)
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

func (v *VSphereBuilder) getVsphereMachineTemplate(ctx context.Context, name, namespace string) (*v1beta12.VSphereMachineTemplate, error) {
	key := fmt.Sprintf("%s/%s", namespace, name)
	vmtInterface, exists, err := v.informers[types.VSphereMachineTemplateGvr].Informer().GetIndexer().GetByKey(key)
	if err != nil {
		return nil, err
	}
	if !exists {
		return nil, fmt.Errorf("not found")
	}
	unstructuredMd := vmtInterface.(*unstructured.Unstructured)
	vmt := &v1beta12.VSphereMachineTemplate{}
	err = runtime.DefaultUnstructuredConverter.FromUnstructured(unstructuredMd.UnstructuredContent(), vmt)
	if err != nil {
		return nil, err
	}
	return vmt, nil
}
