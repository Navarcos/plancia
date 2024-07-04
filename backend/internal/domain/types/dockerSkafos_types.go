package types

import (
	"fmt"
	"github.com/activadigital/plancia/configs"
	"sigs.k8s.io/cluster-api/api/v1beta1"
	cpv1beta1 "sigs.k8s.io/cluster-api/controlplane/kubeadm/api/v1beta1"
	expv1beta1 "sigs.k8s.io/cluster-api/exp/api/v1beta1"
	"strconv"
	"time"
)

type DockerSkafos struct {
	Provider     Provider
	Cluster      *v1beta1.Cluster
	ControlPlane *cpv1beta1.KubeadmControlPlane
	MachinePools []expv1beta1.MachinePool
}

func (d *DockerSkafos) GetName() string {
	return d.Cluster.Name
}

func (d *DockerSkafos) GetNamespace() string {
	return d.Cluster.Namespace
}

func (d *DockerSkafos) GetId() string {
	return fmt.Sprintf("%s-%s", d.Cluster.Namespace, d.Cluster.Name)
}

func (d *DockerSkafos) GetProvider() Provider {
	return d.Provider
}

func (d *DockerSkafos) GetKubernetesVersion() string {
	return d.Cluster.Spec.Topology.Version
}

func (d *DockerSkafos) GetCreationTimestamp() time.Time {
	return d.Cluster.CreationTimestamp.Time
}

func (d *DockerSkafos) GetMasterNodes() *int32 {
	return d.Cluster.Spec.Topology.ControlPlane.Replicas
}

func (d *DockerSkafos) GetData() map[string]string {
	return nil
}

func (d *DockerSkafos) GetWorkerNodes() *int32 {
	var count int32
	for _, pool := range d.Cluster.Spec.Topology.Workers.MachinePools {
		count += *pool.Replicas
	}
	return &count
}

func (d *DockerSkafos) GetStatus() v1beta1.ClusterStatus {
	return d.Cluster.Status
}

type CreateDocker struct {
	Provider string
	ObjectMeta
	Status      v1beta1.ClusterStatus
	MasterNodes *int32
	WorkerNodes *int32
}

func (s *CreateDocker) GetName() string {
	return s.Name
}

func (s *CreateDocker) GetNamespace() string {
	return s.Namespace
}

func (s *CreateDocker) GetId() string {
	return fmt.Sprintf("%s-%s", s.Namespace, s.Name)
}

func (s *CreateDocker) GetProvider() Provider {
	return Docker
}

func (s *CreateDocker) GetKubernetesVersion() string {
	return s.KubernetesVersion
}

func (s *CreateDocker) GetMasterNodes() *int32 {
	return s.MasterNodes
}

func (s *CreateDocker) GetWorkerNodes() *int32 {
	return s.WorkerNodes
}

func (s *CreateDocker) GetCreationTimestamp() time.Time {
	return time.Time{}
}

func (s *CreateDocker) GetStatus() v1beta1.ClusterStatus {
	return s.Status
}

func (s *CreateDocker) GetData() map[string]string {
	oidcConfig := configs.Global().Keycloak
	oidcProvider := fmt.Sprintf("%s/realms/%s", oidcConfig.Url, oidcConfig.Realm)
	return map[string]string{
		"K8S_TENANT_NAMESPACE": s.Namespace,
		"K8S_CLUSTER_NAME":     s.Name,
		"K8S_VERSION":          s.KubernetesVersion,
		"K8S_OIDC_PROVIDER":    oidcProvider,
		"NAVARCOS_CA":          configs.Global().NavarcosCa,
		"K8S_MASTER_NODES":     strconv.Itoa(int(*s.MasterNodes)),
		"K8S_WORKER_NODES":     strconv.Itoa(int(*s.WorkerNodes)),
	}
}
