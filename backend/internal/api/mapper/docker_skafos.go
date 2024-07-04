package mapper

import (
	vspheredto "github.com/activadigital/plancia/internal/api/dtos"
	"github.com/activadigital/plancia/internal/domain/types"
)

func NewDockerSkafos(request vspheredto.CreateDockerRequest) *types.CreateDocker {
	return &types.CreateDocker{
		Provider: types.Docker.String(),
		ObjectMeta: types.ObjectMeta{
			Name:              request.Name,
			Namespace:         request.Namespace,
			KubernetesVersion: request.KubernetesVersion,
		},
		MasterNodes: &request.MasterNodes,
		WorkerNodes: &request.WorkerNodes,
	}
}
