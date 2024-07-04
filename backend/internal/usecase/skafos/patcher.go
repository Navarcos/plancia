package skafos

import (
	"context"
	"encoding/json"
	"github.com/activadigital/plancia/configs/logger"
	"github.com/activadigital/plancia/internal/domain/apperror"
	"github.com/activadigital/plancia/internal/domain/skafos/manager"
	"github.com/activadigital/plancia/internal/domain/types"
	"github.com/activadigital/plancia/internal/util"
	"go.uber.org/zap"
	kv1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"
	patchtype "k8s.io/apimachinery/pkg/types"
	"k8s.io/utils/ptr"
	"sigs.k8s.io/cluster-api/api/v1beta1"
	cpv1beta1 "sigs.k8s.io/cluster-api/controlplane/kubeadm/api/v1beta1"
)

type Patcher interface {
	PatchControlPlane(ctx context.Context, patch types.Patch) error
	PatchMachineDeployment(ctx context.Context, patch types.Patch) error
}

type skafosPatcher struct {
	manager *manager.Manager
}

func NewSkafosPatcher(manager *manager.Manager) Patcher {
	return &skafosPatcher{manager: manager}
}

func (p *skafosPatcher) PatchControlPlane(ctx context.Context, patch types.Patch) error {
	controlPlane, err := p.GetControlPlane(ctx, patch.Name, patch.Namespace)
	if err != nil {
		return err
	}
	condition := util.FindFirst(controlPlane.Status.Conditions, isReadyCondition)
	if condition.Status != kv1.ConditionTrue {
		err = apperror.NewNotReadyError(controlPlane.GetObjectKind(), controlPlane.GetName(), controlPlane.GetNamespace())
		logger.Error(ctx, "error patching resource", zap.Error(err))
		return err
	}
	controlPlane.Spec.Replicas = ptr.To[int32](patch.Nodes)
	data, err := json.Marshal(controlPlane)
	if err != nil {
		return err
	}
	_, err = p.manager.Resource(types.ControlPlaneGvr).Namespace(controlPlane.Namespace).Patch(ctx, controlPlane.Name, patchtype.MergePatchType, data, metav1.PatchOptions{
		FieldManager: "plancia",
	})
	if err != nil {
		return err
	}
	return nil
}

func (p *skafosPatcher) PatchMachineDeployment(ctx context.Context, patch types.Patch) error {
	machineDeployment, err := p.GetMachineDeployment(ctx, patch.Name, patch.Namespace)
	if err != nil {
		return err
	}
	condition := util.FindFirst(machineDeployment.Status.Conditions, isReadyCondition)
	if condition.Status != kv1.ConditionTrue || machineDeployment.Status.Phase != "Running" {
		err = apperror.NewNotReadyError(machineDeployment.GetObjectKind(), machineDeployment.GetName(), machineDeployment.GetNamespace())
		logger.Error(ctx, "error patching resource", zap.Error(err))
		return err
	}
	machineDeployment.Spec.Replicas = ptr.To[int32](patch.Nodes)
	data, err := json.Marshal(machineDeployment)
	if err != nil {
		return err
	}
	_, err = p.manager.Resource(types.MachineDeployGvr).Namespace(machineDeployment.Namespace).Patch(ctx, machineDeployment.Name, patchtype.MergePatchType, data, metav1.PatchOptions{
		FieldManager: "plancia",
	})
	if err != nil {
		return err
	}
	return nil
}

func (p *skafosPatcher) GetControlPlane(ctx context.Context, name, namespace string) (*cpv1beta1.KubeadmControlPlane, error) {
	unstructuredCp, err := p.manager.Resource(types.ControlPlaneGvr).Namespace(namespace).Get(ctx, name, metav1.GetOptions{})
	if err != nil {
		return nil, apperror.NewKubeError(err, apperror.Get, types.ControlPlaneGvr.String(), name)
	}
	cp := &cpv1beta1.KubeadmControlPlane{}
	err = runtime.DefaultUnstructuredConverter.FromUnstructured(unstructuredCp.UnstructuredContent(), cp)
	if err != nil {
		return nil, err
	}
	return cp, nil
}

func (p *skafosPatcher) GetMachineDeployment(ctx context.Context, name, namespace string) (*v1beta1.MachineDeployment, error) {
	unstructuredMd, err := p.manager.Resource(types.MachineDeployGvr).Namespace(namespace).Get(ctx, name, metav1.GetOptions{})
	if err != nil {
		return nil, apperror.NewKubeError(err, apperror.Get, types.ControlPlaneGvr.String(), name)
	}
	md := &v1beta1.MachineDeployment{}
	err = runtime.DefaultUnstructuredConverter.FromUnstructured(unstructuredMd.UnstructuredContent(), md)
	if err != nil {
		return nil, err
	}
	return md, nil
}

func isReadyCondition(elem v1beta1.Condition) bool {
	return elem.Type == "Ready"
}
