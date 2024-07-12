package mapper

import (
	"github.com/activadigital/plancia/internal/api/dtos"
	_ "github.com/activadigital/plancia/internal/api/dtos"
	"github.com/activadigital/plancia/internal/domain/types"
	"k8s.io/apimachinery/pkg/apis/meta/v1/unstructured"
	"strings"
)

func NewExternalCluster(request dtos.ExternalClusterDto) *types.ExternalCluster {
	return &types.ExternalCluster{
		Name:       request.Name,
		Namespace:  request.Namespace,
		Provider:   request.Provider,
		Kubeconfig: request.Kubeconfig,
	}
}

func NewExternalClusterDto(kubeconfig unstructured.Unstructured) dtos.ExternalClusterDto {
	return dtos.ExternalClusterDto{
		Name:      strings.Replace(kubeconfig.GetName(), "-kubeconfig", "", 1),
		Namespace: kubeconfig.GetNamespace(),
		Provider:  kubeconfig.GetLabels()[types.ProviderLabel],
	}
}
