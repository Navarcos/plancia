package resource

import (
	"context"
	"github.com/activadigital/plancia/internal/domain/skafos/client"
	kv1 "k8s.io/api/core/v1"
	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/utils/ptr"
)

func GetPod(ctx context.Context, registry client.SkafosRegistry, params ApiParams) (*kv1.Pod, error) {
	skafosClient, err := registry.Get(ctx, params.SkafosNamespace, params.SkafosName)
	if err != nil {
		return nil, err
	}
	res, err := skafosClient.ClientSet().CoreV1().Pods(params.ResourceNamespace).Get(ctx, params.ResourceName, v1.GetOptions{})
	if err != nil {
		return nil, err
	}
	return res, nil
}

func ListPods(ctx context.Context, registry client.SkafosRegistry, params ApiParams) (*kv1.PodList, error) {
	skafosClient, err := registry.Get(ctx, params.SkafosNamespace, params.SkafosName)
	if err != nil {
		return nil, err
	}
	res, err := skafosClient.ClientSet().CoreV1().Pods(params.ResourceNamespace).List(ctx, v1.ListOptions{
		Limit:          int64(params.Limit),
		Continue:       params.Continue,
		TimeoutSeconds: ptr.To[int64](5),
	})
	if err != nil {
		return nil, err
	}
	return res, nil
}

func DeletePod(ctx context.Context, registry client.SkafosRegistry, params ApiParams) error {
	skafosClient, err := registry.Get(ctx, params.SkafosNamespace, params.SkafosName)
	if err != nil {
		return err
	}
	if err = skafosClient.ClientSet().CoreV1().Pods(params.ResourceNamespace).Delete(ctx, params.ResourceName, v1.DeleteOptions{}); err != nil {
		return err
	}
	return nil
}
