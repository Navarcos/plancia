package dtos

import (
	"sigs.k8s.io/cluster-api/api/v1beta1"
	"time"
)

type GetSkafosListResponse struct {
	Name              string                `json:"name"`
	Namespace         string                `json:"namespace"`
	KubernetesVersion string                `json:"kubernetesVersion"`
	Provider          string                `json:"provider"`
	MasterNodes       *int32                `json:"masterNodes"`
	WorkerNodes       *int32                `json:"workerNodes"`
	Status            v1beta1.ClusterStatus `json:"status"`
	CreationTimestamp time.Time             `json:"creationTimestamp"`
}
