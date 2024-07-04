package types

import "k8s.io/apimachinery/pkg/runtime/schema"

// Core()
var (
	SecretGvr    = schema.GroupVersionResource{Version: "v1", Resource: "secrets"}
	NamespaceGvr = schema.GroupVersionResource{Group: "", Version: "v1", Resource: "namespaces"}
)

// cluster.x-k8s.io
var (
	ClusterGvr      = schema.GroupVersionResource{Group: "cluster.x-k8s.io", Version: "v1beta1", Resource: "clusters"}
	ControlPlaneGvr = schema.GroupVersionResource{Group: "controlplane.cluster.x-k8s.io", Version: "v1beta1", Resource: "kubeadmcontrolplanes"}

	VSphereMachineTemplateGvr = schema.GroupVersionResource{Group: "infrastructure.cluster.x-k8s.io", Version: "v1beta1", Resource: "vspheremachinetemplates"}
	MachineDeployGvr          = schema.GroupVersionResource{Group: "cluster.x-k8s.io", Version: "v1beta1", Resource: "machinedeployments"}

	MachinePoolGvr = schema.GroupVersionResource{Group: "cluster.x-k8s.io", Version: "v1beta1", Resource: "machinepools"}

	IpPoolGvr = schema.GroupVersionResource{Group: "ipam.cluster.x-k8s.io", Version: "v1alpha2", Resource: "inclusterippools"}
)
