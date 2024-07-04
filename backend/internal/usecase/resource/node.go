package resource

import (
	"context"
	"github.com/activadigital/plancia/internal/domain/skafos/client"
	kv1 "k8s.io/api/core/v1"
	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/utils/ptr"
)

func GetNode(ctx context.Context, registry client.SkafosRegistry, params ApiParams) (*kv1.Node, error) {
	skafosClient, err := registry.Get(ctx, params.SkafosNamespace, params.SkafosName)
	if err != nil {
		return nil, err
	}
	res, err := skafosClient.ClientSet().CoreV1().Nodes().Get(ctx, params.ResourceName, v1.GetOptions{})
	if err != nil {
		return nil, err
	}
	return res, nil
}

func ListNodes(ctx context.Context, registry client.SkafosRegistry, params ApiParams) (*kv1.NodeList, error) {
	skafosClient, err := registry.Get(ctx, params.SkafosNamespace, params.SkafosName)
	if err != nil {
		return nil, err
	}
	res, err := skafosClient.ClientSet().CoreV1().Nodes().List(ctx, v1.ListOptions{
		Limit:          int64(params.Limit),
		Continue:       params.Continue,
		TimeoutSeconds: ptr.To[int64](5),
	})
	if err != nil {
		return nil, err
	}
	return res, nil
}
