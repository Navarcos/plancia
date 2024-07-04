package mapper

import (
	vspheredto "github.com/activadigital/plancia/internal/api/dtos"
	"github.com/activadigital/plancia/internal/domain/types"
)

func NewVSphereSkafos(request vspheredto.CreateVsphereRequest) *types.CreateVsphere {
	skafos := &types.CreateVsphere{
		Provider: types.Vsphere.String(),
		ObjectMeta: types.ObjectMeta{
			Name:              request.Name,
			Namespace:         request.Namespace,
			KubernetesVersion: request.KubernetesVersion,
		},
		Credentials: types.VsphereCredentials{
			Username: request.Credentials.Username,
			Password: request.Credentials.Password,
		},
		Spec: newVsphereSpec(request),
	}
	if request.Spec.IpPool != nil {
		skafos.Spec.IpPool = newIpPool(request.Spec.IpPool)
	}
	return skafos
}

func newVsphereSpec(request vspheredto.CreateVsphereRequest) types.VSphereSpec {
	return types.VSphereSpec{
		Server:                 request.Spec.Server,
		Datacenter:             request.Spec.Datacenter,
		VCenterTlsThumbprint:   request.Spec.VCenterTlsThumbprint,
		SshAuthorizedKey:       request.Spec.SshAuthorizedKey,
		Datastore:              request.Spec.Datastore,
		Network:                request.Spec.Network,
		ResourcePool:           request.Spec.ResourcePool,
		Folder:                 request.Spec.Folder,
		MachineTemplate:        request.Spec.MachineTemplate,
		ControlPlaneEndpointIp: request.Spec.ControlPlaneEndpointIp,
		StoragePolicy:          request.Spec.StoragePolicy,
		DatastoreUrl:           request.Spec.DatastoreUrl,
		Nameserver1:            request.Spec.Nameserver1,
		Nameserver2:            request.Spec.Nameserver2,
		Dhcp:                   *request.Spec.Dhcp,
		MasterSpec: types.VSphereNodeSpec{
			Number:   &request.Spec.MasterNodes,
			DiskGb:   request.Spec.MasterDiskGb,
			Cpus:     request.Spec.MasterCpus,
			MemoryMb: request.Spec.MasterMemGb * 1024,
		},
		WorkerSpec: types.VSphereNodeSpec{
			Number:   &request.Spec.WorkerNodes,
			DiskGb:   request.Spec.WorkerDiskGb,
			Cpus:     request.Spec.WorkerCpus,
			MemoryMb: request.Spec.WorkerMemGb * 1024,
		},
		IpPool: newIpPool(request.Spec.IpPool),
	}
}

func newIpPool(ipPool *vspheredto.IpPool) types.IpPool {
	if ipPool == nil {
		return types.IpPool{}
	}
	return types.IpPool{
		NetworkSubnet:  ipPool.NetworkSubnet,
		NetworkGateway: ipPool.NetworkGateway,
		NetworkStart:   ipPool.NetworkStart,
		NetworkEnd:     ipPool.NetworkEnd,
	}
}
