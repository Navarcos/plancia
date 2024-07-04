package dtos

import (
	cpv1beta1 "sigs.k8s.io/cluster-api/controlplane/kubeadm/api/v1beta1"
)

type GetSkafosResponse struct {
	Name               string              `json:"name"`
	Namespace          string              `json:"namespace"`
	Provider           string              `json:"provider"`
	ControlPlane       ControlPlane        `json:"controlPlane"`
	MachineDeployments []MachineDeployment `json:"machineDeployments"`
}

type ControlPlane struct {
	Name              string                              `json:"name"`
	KubernetesVersion string                              `json:"kubernetesVersion"`
	Nodes             *int32                              `json:"nodes"`
	Status            cpv1beta1.KubeadmControlPlaneStatus `json:"status"`
}

type MachineDeployment struct {
	Name   string `json:"name"`
	Nodes  *int32 `json:"nodes"`
	Status Status `json:"status"`
}

type Status struct {
	Phase               string `json:"phase"`
	Replicas            int32  `json:"replicas"`
	ReadyReplicas       int32  `json:"readyReplicas"`
	UnavailableReplicas int32  `json:"unavailableReplicas"`
	UpdatedReplicas     int32  `json:"updatedReplicas"`
}
