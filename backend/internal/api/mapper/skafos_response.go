package mapper

import (
	"github.com/activadigital/plancia/internal/api/dtos"
	"github.com/activadigital/plancia/internal/domain/types"
	"sigs.k8s.io/cluster-api/api/v1beta1"
	cpv1beta1 "sigs.k8s.io/cluster-api/controlplane/kubeadm/api/v1beta1"
	expv1beta1 "sigs.k8s.io/cluster-api/exp/api/v1beta1"
)

func NewPatch(name string, namespace string, nodes int32) types.Patch {
	return types.Patch{
		Name:      name,
		Namespace: namespace,
		Nodes:     nodes,
	}
}

func NewGetSkafosListResponse(skafos types.Skafos) dtos.GetSkafosListResponse {
	if skafos == nil {
		return dtos.GetSkafosListResponse{}
	}
	return dtos.GetSkafosListResponse{
		Name:              skafos.GetName(),
		Namespace:         skafos.GetNamespace(),
		KubernetesVersion: skafos.GetKubernetesVersion(),
		Provider:          skafos.GetProvider().String(),
		MasterNodes:       skafos.GetMasterNodes(),
		WorkerNodes:       skafos.GetWorkerNodes(),
		Status:            skafos.GetStatus(),
		CreationTimestamp: skafos.GetCreationTimestamp(),
	}
}

func NewGetDockerSkafosResponse(skafos *types.DockerSkafos) dtos.GetSkafosResponse {
	return dtos.GetSkafosResponse{
		Name:               skafos.Cluster.Name,
		Namespace:          skafos.Cluster.Namespace,
		Provider:           skafos.Provider.String(),
		ControlPlane:       newControlPlaneResponse(skafos.ControlPlane),
		MachineDeployments: fromDockerMachinePools(skafos.MachinePools),
	}
}

func fromDockerMachinePools(machinePools []expv1beta1.MachinePool) []dtos.MachineDeployment {
	result := make([]dtos.MachineDeployment, 1, len(machinePools))
	for i, mp := range machinePools {
		machineDeployment := dtos.MachineDeployment{
			Name:   mp.Name,
			Nodes:  mp.Spec.Replicas,
			Status: statusFromMachinePool(mp.Status),
		}
		result[i] = machineDeployment
	}
	return result
}

func statusFromMachinePool(status expv1beta1.MachinePoolStatus) dtos.Status {
	return dtos.Status{
		Phase:               status.Phase,
		ReadyReplicas:       status.ReadyReplicas,
		UnavailableReplicas: status.UnavailableReplicas,
		UpdatedReplicas:     status.UnavailableReplicas,
		Replicas:            status.Replicas,
	}
}

func NewGetVsphereSkafosResponse(skafos *types.VsphereSkafos) dtos.GetSkafosResponse {
	return dtos.GetSkafosResponse{
		Name:               skafos.Cluster.Name,
		Namespace:          skafos.Cluster.Namespace,
		Provider:           skafos.Provider.String(),
		ControlPlane:       newControlPlaneResponse(skafos.ControlPlane),
		MachineDeployments: newMachineDeploymentsResponse(skafos),
	}
}

func newMachineDeploymentsResponse(skafos *types.VsphereSkafos) []dtos.MachineDeployment {
	result := make([]dtos.MachineDeployment, 0, len(skafos.WorkerPools))
	for _, md := range skafos.WorkerPools {
		machineDeployment := dtos.MachineDeployment{
			Name:   md.MachineDeployment.Name,
			Nodes:  md.MachineDeployment.Spec.Replicas,
			Status: statusFromMachineDeployment(md.MachineDeployment.Status),
		}
		result = append(result, machineDeployment)
	}
	return result
}

func statusFromMachineDeployment(status v1beta1.MachineDeploymentStatus) dtos.Status {
	return dtos.Status{
		Phase:               status.Phase,
		ReadyReplicas:       status.ReadyReplicas,
		UnavailableReplicas: status.UnavailableReplicas,
		UpdatedReplicas:     status.UnavailableReplicas,
		Replicas:            status.Replicas,
	}
}

func newControlPlaneResponse(cp *cpv1beta1.KubeadmControlPlane) dtos.ControlPlane {
	return dtos.ControlPlane{
		Name:              cp.Name,
		KubernetesVersion: cp.Spec.Version,
		Nodes:             cp.Spec.Replicas,
		Status:            cp.Status,
	}
}
