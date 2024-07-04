package resource

import (
	"context"
	"github.com/activadigital/plancia/internal/domain/skafos/client"
	kv1 "k8s.io/api/core/v1"
	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/utils/ptr"
)

func GetPersistentVolume(ctx context.Context, registry client.SkafosRegistry, params ApiParams) (*kv1.PersistentVolume, error) {
	skafosClient, err := registry.Get(ctx, params.SkafosNamespace, params.SkafosName)
	if err != nil {
		return nil, err
	}
	res, err := skafosClient.ClientSet().CoreV1().PersistentVolumes().Get(ctx, params.ResourceName, v1.GetOptions{})
	if err != nil {
		return nil, err
	}
	return res, nil
}

func ListPersistentVolumes(ctx context.Context, registry client.SkafosRegistry, params ApiParams) (*kv1.PersistentVolumeList, error) {
	skafosClient, err := registry.Get(ctx, params.SkafosNamespace, params.SkafosName)
	if err != nil {
		return nil, err
	}
	res, err := skafosClient.ClientSet().CoreV1().PersistentVolumes().List(ctx, v1.ListOptions{
		Limit:          int64(params.Limit),
		Continue:       params.Continue,
		TimeoutSeconds: ptr.To[int64](5),
	})
	if err != nil {
		return nil, err
	}
	return res, nil
}

func DeletePersistentVolume(ctx context.Context, registry client.SkafosRegistry, params ApiParams) error {
	skafosClient, err := registry.Get(ctx, params.SkafosNamespace, params.SkafosName)
	if err != nil {
		return err
	}
	if err = skafosClient.ClientSet().CoreV1().PersistentVolumes().Delete(ctx, params.ResourceName, v1.DeleteOptions{}); err != nil {
		return err
	}
	return nil
}
