package dtos

import (
	"github.com/go-playground/validator/v10"
)

type CreateVsphereRequest struct {
	Namespace         string          `json:"namespace" validate:"required"`
	Name              string          `json:"name" validate:"required,max=20"`
	KubernetesVersion string          `json:"kubernetesVersion" validate:"required,semver"`
	Credentials       *CredentialsDto `json:"credentials" validate:"required"`
	Spec              *ClusterSpec    `json:"spec" validate:"required"`
}

type CreateDockerRequest struct {
	Namespace         string `json:"namespace" validate:"required"`
	Name              string `json:"name" validate:"required,max=20"`
	KubernetesVersion string `json:"kubernetesVersion" validate:"required,semver"`
	MasterNodes       int32  `json:"masterNodes" validate:"required"`
	WorkerNodes       int32  `json:"workerNodes" validate:"required"`
}

type CredentialsDto struct {
	Username string `json:"username" validate:"required"`
	Password string `json:"password" validate:"required"`
}

type ClusterSpec struct {
	Server                 string  `json:"server" validate:"required"`
	Datacenter             string  `json:"datacenter" validate:"required"`
	VCenterTlsThumbprint   string  `json:"vCenterTlsThumbprint" validate:"required"`
	SshAuthorizedKey       string  `json:"sshAuthorizedKey" validate:"required"`
	Datastore              string  `json:"datastore" validate:"required"`
	Network                string  `json:"network" validate:"required"`
	ResourcePool           string  `json:"resourcePool" validate:"required"`
	Folder                 string  `json:"folder" validate:"required"`
	MachineTemplate        string  `json:"machineTemplate" validate:"required"`
	ControlPlaneEndpointIp string  `json:"controlPlaneEndpointIp" validate:"required"`
	StoragePolicy          string  `json:"storagePolicy"`
	DatastoreUrl           string  `json:"datastoreUrl" validate:"required"`
	Nameserver1            string  `json:"nameserver1" validate:"required"`
	Nameserver2            string  `json:"nameserver2" validate:"required"`
	MasterNodes            int32   `json:"masterNodes" validate:"required"`
	MasterDiskGb           int     `json:"masterDisk" validate:"required"`
	MasterCpus             int     `json:"masterCpus" validate:"required"`
	MasterMemGb            int     `json:"masterMem" validate:"required"`
	WorkerNodes            int32   `json:"workerNodes" validate:"required"`
	WorkerDiskGb           int     `json:"workerDisk" validate:"required"`
	WorkerCpus             int     `json:"workerCpus" validate:"required"`
	WorkerMemGb            int     `json:"workerMem" validate:"required"`
	Dhcp                   *bool   `json:"dhcp" validate:"required"`
	IpPool                 *IpPool `json:"ipPool" validate:"omitempty"`
}

type IpPool struct {
	NetworkSubnet  string `json:"networkSubnet"`
	NetworkGateway string `json:"networkGateway"`
	NetworkStart   string `json:"networkStart"`
	NetworkEnd     string `json:"networkEnd"`
}

func (c CreateVsphereRequest) Valid() error {
	v := validator.New()
	return v.Struct(c)
}

func (d CreateDockerRequest) Valid() error {
	v := validator.New()
	return v.Struct(d)
}
