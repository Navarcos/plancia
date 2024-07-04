package builder

import (
	"context"
	"github.com/activadigital/plancia/internal/domain/types"
	"sigs.k8s.io/cluster-api/api/v1beta1"
)

type DefaultBuilder struct{}

func newDefaultBuilder() BuilderStrategy {
	return &DefaultBuilder{}
}

func (b *DefaultBuilder) Build(ctx context.Context, cluster *v1beta1.Cluster) (types.Skafos, error) {
	return &types.VsphereSkafos{
		Provider:                   0,
		Cluster:                    cluster,
		ControlPlane:               nil,
		ControlPlaneInfrastructure: nil,
		WorkerPools:                nil,
	}, nil
}
