package resource

import (
	"context"
	"github.com/activadigital/plancia/internal/domain/skafos/client"
	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/apis/meta/v1/unstructured"
	"k8s.io/apimachinery/pkg/runtime/schema"
	"k8s.io/utils/ptr"
)

func GetGvr(ctx context.Context, registry client.SkafosRegistry, gvr schema.GroupVersionResource, params ApiParams) (*unstructured.Unstructured, error) {
	skafosClient, err := registry.Get(ctx, params.SkafosNamespace, params.SkafosName)
	if err != nil {
		return nil, err
	}
	res, err := skafosClient.Dynamic().Resource(gvr).Namespace(params.ResourceNamespace).Get(ctx, params.ResourceName, v1.GetOptions{})
	if err != nil {
		return nil, err
	}
	return res, nil
}

func ListGvr(ctx context.Context, registry client.SkafosRegistry, gvr schema.GroupVersionResource, params ApiParams) (*unstructured.UnstructuredList, error) {
	skafosClient, err := registry.Get(ctx, params.SkafosNamespace, params.SkafosName)
	if err != nil {
		return nil, err
	}
	res, err := skafosClient.Dynamic().Resource(gvr).Namespace(params.ResourceNamespace).List(ctx, v1.ListOptions{
		Limit:          int64(params.Limit),
		Continue:       params.Continue,
		TimeoutSeconds: ptr.To[int64](5),
	})
	if err != nil {
		return nil, err
	}
	return res, nil
}

func DeleteGvr(ctx context.Context, registry client.SkafosRegistry, gvr schema.GroupVersionResource, params ApiParams) error {
	skafosClient, err := registry.Get(ctx, params.SkafosNamespace, params.SkafosName)
	if err != nil {
		return err
	}
	if err = skafosClient.Dynamic().Resource(gvr).Namespace(params.ResourceNamespace).Delete(ctx, params.ResourceName, v1.DeleteOptions{}); err != nil {
		return err
	}
	return nil
}
