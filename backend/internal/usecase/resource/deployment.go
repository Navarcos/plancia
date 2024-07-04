package resource

import (
	"context"
	"github.com/activadigital/plancia/internal/domain/skafos/client"
	appv1 "k8s.io/api/apps/v1"
	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/utils/ptr"
)

func GetDeployment(ctx context.Context, registry client.SkafosRegistry, params ApiParams) (*appv1.Deployment, error) {
	skafosClient, err := registry.Get(ctx, params.SkafosNamespace, params.SkafosName)
	if err != nil {
		return nil, err
	}
	res, err := skafosClient.ClientSet().AppsV1().Deployments(params.ResourceNamespace).Get(ctx, params.ResourceName, v1.GetOptions{})
	if err != nil {
		return nil, err
	}
	return res, nil
}

func ListDeployments(ctx context.Context, registry client.SkafosRegistry, params ApiParams) (*appv1.DeploymentList, error) {
	skafosClient, err := registry.Get(ctx, params.SkafosNamespace, params.SkafosName)
	if err != nil {
		return nil, err
	}
	res, err := skafosClient.ClientSet().AppsV1().Deployments(params.ResourceNamespace).List(ctx, v1.ListOptions{
		Limit:          int64(params.Limit),
		Continue:       params.Continue,
		TimeoutSeconds: ptr.To[int64](5),
	})
	if err != nil {
		return nil, err
	}
	return res, nil
}

func DeleteDeployment(ctx context.Context, registry client.SkafosRegistry, params ApiParams) error {
	skafosClient, err := registry.Get(ctx, params.SkafosNamespace, params.SkafosName)
	if err != nil {
		return err
	}
	if err = skafosClient.ClientSet().AppsV1().Deployments(params.ResourceNamespace).Delete(ctx, params.ResourceName, v1.DeleteOptions{}); err != nil {
		return err
	}
	return nil
}
