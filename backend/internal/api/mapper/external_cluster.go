package mapper

import (
	"fmt"
	"github.com/activadigital/plancia/internal/api/dtos"
	_ "github.com/activadigital/plancia/internal/api/dtos"
	"github.com/activadigital/plancia/internal/domain/types"
	"k8s.io/apimachinery/pkg/apis/meta/v1/unstructured"
)

func NewExternalCluster(request dtos.ExternalClusterDto) *types.ExternalCluster {
	return &types.ExternalCluster{
		Name:       fmt.Sprintf("%s-%s", request.Namespace, request.Name),
		Namespace:  request.Namespace,
		Provider:   request.Provider,
		Kubeconfig: request.Kubeconfig,
	}
}

func NewExternalClusterDto(kubeconfig unstructured.Unstructured) dtos.ExternalClusterDto {
	return dtos.ExternalClusterDto{
		Name:      kubeconfig.GetName(),
		Namespace: kubeconfig.GetNamespace(),
		Provider:  kubeconfig.GetLabels()[types.ProviderLabel],
	}
}
