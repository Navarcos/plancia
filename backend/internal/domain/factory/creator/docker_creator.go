package creator

import (
	"context"
	"github.com/activadigital/plancia/configs"
	"github.com/activadigital/plancia/configs/logger"
	"github.com/activadigital/plancia/internal/adapters/manifest/file"
	"github.com/activadigital/plancia/internal/domain/apperror"
	"github.com/activadigital/plancia/internal/domain/skafos/manager"
	"github.com/activadigital/plancia/internal/domain/types"
	"go.uber.org/zap"
	"k8s.io/apimachinery/pkg/api/errors"
	"k8s.io/apimachinery/pkg/api/meta"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/apis/meta/v1/unstructured"
	kyaml "k8s.io/apimachinery/pkg/runtime/serializer/yaml"
	"k8s.io/client-go/dynamic"
	"regexp"
)

type DockerCreator struct {
	skafosManager *manager.Manager
}

func newDockerCreator(skafosManager *manager.Manager) CreationStrategy {
	return &DockerCreator{
		skafosManager: skafosManager,
	}
}

func (c *DockerCreator) Create(ctx context.Context, skafos types.Skafos) error {
	capiManifest, err := file.GetManifest(ctx, file.DockerCapiPath, skafos.GetData())
	if err != nil {
		return err
	}
	err = c.apply(ctx, capiManifest)
	if err != nil {
		return err
	}
	logger.Debug(ctx, "all capi resources applied")
	return nil
}

func (c *DockerCreator) apply(ctx context.Context, capiManifest string) error {
	resources, err := c.parse(ctx, capiManifest)
	if err != nil {
		logger.Error(ctx, "error parsing resources from file", zap.Error(err))
		return err
	}

	err = c.create(ctx, resources)
	if err != nil {
		logger.Error(ctx, "error applying capi resources", zap.Error(err))
		return apperror.NewKubeError(err, apperror.Apply, "skafos", "")
	}
	return nil
}

func (c *DockerCreator) parse(ctx context.Context, manifest string) ([]resource, error) {
	var decUnstructured = kyaml.NewDecodingSerializer(unstructured.UnstructuredJSONScheme)
	re, err := regexp.Compile("(?m)^---[[:space:]]*$")
	if err != nil {
		return nil, err
	}
	manifests := re.Split(manifest, -1)
	result := make([]resource, 0, len(manifests))
	for _, current := range manifests {
		obj := &unstructured.Unstructured{}
		_, gvk, err := decUnstructured.Decode([]byte(current), nil, obj)
		if err != nil {
			return nil, apperror.NewInternalError(err)
		}
		mapping, err := c.skafosManager.RESTMapping(gvk.GroupKind(), gvk.Version)
		if err != nil {
			return nil, err
		}
		result = append(result, resource{mapping: mapping, unstr: obj})
	}
	return result, nil
}

func (c *DockerCreator) getScopedClient(mapping *meta.RESTMapping, namespace string) (dr dynamic.ResourceInterface) {
	if mapping.Scope.Name() == meta.RESTScopeNameNamespace {
		dr = c.skafosManager.Resource(mapping.Resource).Namespace(namespace)
	} else {
		dr = c.skafosManager.Resource(mapping.Resource)
	}
	return
}

func (c *DockerCreator) create(ctx context.Context, resources []resource) error {
	for _, res := range resources {
		dr := c.getScopedClient(res.mapping, res.unstr.GetNamespace())
		_, err := dr.Create(ctx, res.unstr, metav1.CreateOptions{
			FieldManager: configs.Global().ServiceName,
		})
		if err != nil && !errors.IsAlreadyExists(err) {
			return err
		}
	}
	return nil
}
