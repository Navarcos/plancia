package builder

import (
	"context"
	"github.com/activadigital/plancia/internal/domain/types"
	"k8s.io/apimachinery/pkg/runtime/schema"
	"k8s.io/client-go/informers"
	"sigs.k8s.io/cluster-api/api/v1beta1"
)

func Builder(provider types.Provider, informers map[schema.GroupVersionResource]informers.GenericInformer) BuilderStrategy {
	switch provider {
	case types.Vsphere:
		return newVsphereBuilder(informers)
	case types.Docker:
		return newDockerBuilder(informers)

	default:
		return newDefaultBuilder()

	}
}

type BuilderStrategy interface {
	Build(ctx context.Context, cluster *v1beta1.Cluster) (types.Skafos, error)
}
