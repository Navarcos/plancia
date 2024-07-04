package types

import (
	"fmt"
	"github.com/activadigital/plancia/configs"
	mtv1beta1 "sigs.k8s.io/cluster-api-provider-vsphere/apis/v1beta1"
	"sigs.k8s.io/cluster-api/api/v1beta1"
	cpv1beta1 "sigs.k8s.io/cluster-api/controlplane/kubeadm/api/v1beta1"
	"strconv"
	"time"
)

type VsphereSkafos struct {
	Provider                   Provider
	Cluster                    *v1beta1.Cluster
	ControlPlane               *cpv1beta1.KubeadmControlPlane
	ControlPlaneInfrastructure *mtv1beta1.VSphereMachineTemplate
	WorkerPools                []WorkerPool
}

func (s *VsphereSkafos) GetName() string {
	return s.Cluster.Name
}

func (s *VsphereSkafos) GetNamespace() string {
	return s.Cluster.Namespace
}

func (s *VsphereSkafos) GetId() string {
	return fmt.Sprintf("%s-%s", s.Cluster.Namespace, s.Cluster.Name)
}

func (s *VsphereSkafos) GetProvider() Provider {
	return s.Provider
}

func (s *VsphereSkafos) GetKubernetesVersion() string {
	return s.ControlPlane.Spec.Version
}

func (s *VsphereSkafos) GetCreationTimestamp() time.Time {
	return s.Cluster.CreationTimestamp.Time
}

func (s *VsphereSkafos) GetMasterNodes() *int32 {
	return s.ControlPlane.Spec.Replicas
}

func (s *VsphereSkafos) GetWorkerNodes() *int32 {
	var count int32
	for _, pool := range s.WorkerPools {
		count += *pool.MachineDeployment.Spec.Replicas
	}
	return &count
}

type WorkerPool struct {
	MachineDeployment               *v1beta1.MachineDeployment
	MachineDeploymentInfrastructure *mtv1beta1.VSphereMachineTemplate
}

func (s *VsphereSkafos) GetData() map[string]string {
	return nil
}

func (s *VsphereSkafos) GetStatus() v1beta1.ClusterStatus {
	return s.Cluster.Status
}

type CreateVsphere struct {
	Provider string
	ObjectMeta
	Credentials VsphereCredentials
	Spec        VSphereSpec
	Status      v1beta1.ClusterStatus
}

func (s *CreateVsphere) GetName() string {
	return s.Name
}

func (s *CreateVsphere) GetNamespace() string {
	return s.Namespace
}

func (s *CreateVsphere) GetId() string {
	return fmt.Sprintf("%s-%s", s.Namespace, s.Name)
}

func (s *CreateVsphere) GetProvider() Provider {
	return Vsphere
}

func (s *CreateVsphere) GetKubernetesVersion() string {
	return s.KubernetesVersion
}

func (s *CreateVsphere) GetMasterNodes() *int32 {
	return s.Spec.MasterSpec.Number
}

func (s *CreateVsphere) GetWorkerNodes() *int32 {
	return s.Spec.WorkerSpec.Number
}

func (s *CreateVsphere) GetCreationTimestamp() time.Time {
	return time.Time{}
}

func (s *CreateVsphere) GetStatus() v1beta1.ClusterStatus {
	return s.Status
}

func (s *CreateVsphere) GetData() map[string]string {
	oidcConfig := configs.Global().Keycloak
	oidcProvider := fmt.Sprintf("%s/realms/%s", oidcConfig.Url, oidcConfig.Realm)
	return map[string]string{
		"K8S_TENANT_NAMESPACE":       s.Namespace,
		"K8S_CLUSTER_NAME":           s.Name,
		"K8S_VERSION":                s.KubernetesVersion,
		"K8S_OIDC_PROVIDER":          oidcProvider,
		"VSPHERE_USERNAME":           s.Credentials.Username,
		"VSPHERE_PASSWORD":           s.Credentials.Password,
		"VSPHERE_SERVER":             s.Spec.Server,
		"VSPHERE_TLS_THUMBPRINT":     s.Spec.VCenterTlsThumbprint,
		"VSPHERE_DATACENTER":         s.Spec.Datacenter,
		"VSPHERE_DATASTORE":          s.Spec.Datastore,
		"VSPHERE_NETWORK":            s.Spec.Network,
		"VSPHERE_NETWORK_DHCP":       fmt.Sprintf("%v", s.Spec.Dhcp),
		"VSPHERE_RESOURCE_POOL":      s.Spec.ResourcePool,
		"VSPHERE_FOLDER":             s.Spec.Folder,
		"VSPHERE_TEMPLATE":           s.Spec.MachineTemplate,
		"CONTROL_PLANE_ENDPOINT_IP":  s.Spec.ControlPlaneEndpointIp,
		"VSPHERE_SSH_AUTHORIZED_KEY": s.Spec.SshAuthorizedKey,
		"VSPHERE_STORAGE_POLICY":     s.Spec.StoragePolicy,
		"VSPHERE_DATASTOREURL":       s.Spec.DatastoreUrl,
		"NAMESERVER1":                s.Spec.Nameserver1,
		"NAMESERVER2":                s.Spec.Nameserver2,
		"K8S_MASTER_NODES":           strconv.Itoa(int(*s.Spec.MasterSpec.Number)),
		"K8S_MASTER_DISK":            strconv.Itoa(s.Spec.MasterSpec.DiskGb),
		"K8S_MASTER_CPUS":            strconv.Itoa(s.Spec.MasterSpec.Cpus),
		"K8S_MASTER_MEM":             strconv.Itoa(s.Spec.MasterSpec.MemoryMb),
		"K8S_WORKER_NODES":           strconv.Itoa(int(*s.Spec.WorkerSpec.Number)),
		"K8S_WORKER_DISK":            strconv.Itoa(s.Spec.WorkerSpec.DiskGb),
		"K8S_WORKER_CPUS":            strconv.Itoa(s.Spec.WorkerSpec.Cpus),
		"K8S_WORKER_MEM":             strconv.Itoa(s.Spec.WorkerSpec.MemoryMb),
		"NAVARCOS_CA":                configs.Global().NavarcosCa,
		"VSPHERE_NETWORK_SUBNET":     s.Spec.IpPool.NetworkSubnet,
		"VSPHERE_NETWORK_GATEWAY":    s.Spec.IpPool.NetworkGateway,
		"VSPHERE_NETWORK_START":      s.Spec.IpPool.NetworkStart,
		"VSPHERE_NETWORK_END":        s.Spec.IpPool.NetworkEnd,
		"K8S_VSPHERE_USERNAME":       s.Credentials.Username,
		"K8S_VSPHERE_PASSWORD":       s.Credentials.Password,
	}
}

type VsphereCredentials struct {
	Username string
	Password string
}

type VSphereSpec struct {
	Server                 string
	Datacenter             string
	VCenterTlsThumbprint   string
	SshAuthorizedKey       string
	Datastore              string
	Network                string
	ResourcePool           string
	Folder                 string
	MachineTemplate        string
	ControlPlaneEndpointIp string
	StoragePolicy          string
	DatastoreUrl           string
	Nameserver1            string
	Nameserver2            string
	Dhcp                   bool
	MasterSpec             VSphereNodeSpec
	WorkerSpec             VSphereNodeSpec
	IpPool                 IpPool
}

type VSphereNodeSpec struct {
	Number   *int32
	DiskGb   int
	Cpus     int
	MemoryMb int
}

type IpPool struct {
	NetworkSubnet  string
	NetworkGateway string
	NetworkStart   string
	NetworkEnd     string
}
