package types

import (
	"github.com/activadigital/plancia/internal/domain/apperror"
	"sigs.k8s.io/cluster-api/api/v1beta1"
	"time"
)

type Skafos interface {
	GetData() map[string]string
	GetName() string
	GetNamespace() string
	GetId() string
	GetProvider() Provider
	GetKubernetesVersion() string
	GetCreationTimestamp() time.Time
	GetMasterNodes() *int32
	GetWorkerNodes() *int32
	GetStatus() v1beta1.ClusterStatus
}

type Provider int

const (
	_ Provider = iota
	Vsphere
	Azure
	Docker
)

func ProviderFromValue(v string) (Provider, error) {
	switch v {
	case "vsphere", "Vsphere", "VSphere", "VSPHERE":
		return Vsphere, nil
	case "docker", "Docker", "DOCKER":
		return Docker, nil
	default:
		return Provider(0), apperror.NewProviderError(v)
	}
}

func (p Provider) String() string {
	return []string{"unknown", "vsphere", "azure", "docker"}[p]
}

type ObjectMeta struct {
	Name              string `json:"name,omitempty"`
	Namespace         string `json:"namespace,omitempty"`
	KubernetesVersion string `json:"kubernetesVersion,omitempty"`
}

type SkafosStatus struct {
	ControlPlaneReady   bool
	InfrastructureReady bool
	FailureMessage      *string
}
