package creator

import (
	"bytes"
	"context"
	"encoding/json"
	"github.com/activadigital/plancia/configs"
	"github.com/activadigital/plancia/configs/logger"
	"github.com/activadigital/plancia/internal/adapters/manifest/file"
	"github.com/activadigital/plancia/internal/domain/apperror"
	"github.com/activadigital/plancia/internal/domain/skafos/manager"
	"github.com/activadigital/plancia/internal/domain/types"
	"go.uber.org/zap"
	"k8s.io/apimachinery/pkg/api/meta"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/apis/meta/v1/unstructured"
	kyaml "k8s.io/apimachinery/pkg/runtime/serializer/yaml"
	ktypes "k8s.io/apimachinery/pkg/types"
	"k8s.io/client-go/dynamic"
	"k8s.io/utils/ptr"
	"regexp"
)

type VsphereCreator struct {
	skafosManager *manager.Manager
}

func newVsphereCreator(skafosManager *manager.Manager) CreationStrategy {
	return &VsphereCreator{
		skafosManager: skafosManager,
	}
}

func (c *VsphereCreator) Create(ctx context.Context, skafos types.Skafos) error {
	ipPoolManifest, err := file.GetManifest(ctx, file.VSphereIpPoolPath, skafos.GetData())
	if err != nil {
		return err
	}
	err = c.apply(ctx, ipPoolManifest)
	if err != nil {
		return err
	}

	capiManifest, err := file.GetManifest(ctx, file.VSphereCapiPath, skafos.GetData())
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

func (c *VsphereCreator) apply(ctx context.Context, capiManifest string) error {
	resources, err := c.parse(ctx, capiManifest)
	if err != nil {
		logger.Error(ctx, "error parsing resources from file", zap.Error(err))
		return err
	}
	err = c.validate(ctx, resources)
	if err != nil {
		logger.Error(ctx, "server side validation failed", zap.Error(err))
		return apperror.NewValidationError(err.Error())
	}
	err = c.applyPatch(ctx, resources, nil)
	if err != nil {
		logger.Error(ctx, "error applying capi resources", zap.Error(err))
		return apperror.NewKubeError(err, apperror.Apply, "skafos", "")
	}
	return nil
}

type resource struct {
	mapping *meta.RESTMapping
	unstr   *unstructured.Unstructured
}

func (c *VsphereCreator) parse(ctx context.Context, manifest string) ([]resource, error) {
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

func (c *VsphereCreator) getScopedClient(mapping *meta.RESTMapping, namespace string) (dr dynamic.ResourceInterface) {
	if mapping.Scope.Name() == meta.RESTScopeNameNamespace {
		dr = c.skafosManager.Resource(mapping.Resource).Namespace(namespace)
	} else {
		dr = c.skafosManager.Resource(mapping.Resource)
	}
	return
}

func (c *VsphereCreator) validate(ctx context.Context, resources []resource) error {
	return c.applyPatch(ctx, resources, []string{"All"})
}

func (c *VsphereCreator) applyPatch(ctx context.Context, resources []resource, dryRun []string) error {
	for _, res := range resources {
		dr := c.getScopedClient(res.mapping, res.unstr.GetNamespace())
		data, err := json.Marshal(res.unstr)
		if err != nil {
			return err
		}
		data = bytes.ReplaceAll(data, []byte(":null"), []byte(":\"\""))
		_, err = dr.Patch(ctx, res.unstr.GetName(), ktypes.ApplyPatchType, data, metav1.PatchOptions{
			Force:        ptr.To(true),
			FieldManager: configs.Global().ServiceName,
			DryRun:       dryRun,
		})
		if err != nil {
			return err
		}
	}
	return nil
}
