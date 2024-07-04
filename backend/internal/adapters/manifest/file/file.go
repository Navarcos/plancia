package file

import (
	"bytes"
	"context"
	"github.com/Masterminds/sprig/v3"
	"github.com/activadigital/plancia/internal/domain/apperror"
	"github.com/google/uuid"
	"os"
	"path/filepath"
	"strings"
	"text/template"
)

const (
	VSphereCapiPath   = "manifest/vsphere/cluster-api.yaml"
	VSphereIpPoolPath = "manifest/vsphere/ip-pool.yaml"
	CpiValuesPath     = "manifest/vsphere/cpi-values.yaml"
	CsiValuesPath     = "manifest/vsphere/csi-values.yaml"
	StorageClassPath  = "manifest/vsphere/storage-class.yaml"

	DockerCapiPath = "manifest/docker/cluster-api.yaml"
)

func GetManifest(ctx context.Context, url string, data map[string]string) (string, error) {
	absPath, _ := filepath.Abs(url)
	content, err := readFile(absPath)
	if err != nil {
		return "", apperror.NewInternalError(err)
	}
	content = replaceCa(url, content)
	manifest, err := substituteValues(content, data)
	if err != nil {
		return "", apperror.NewInternalError(err)
	}
	return manifest, nil
}

func replaceCa(url, content string) string {
	switch url {
	case VSphereCapiPath:
		{
			content = strings.Replace(content, "${NAVARCOS_CA}", "${NAVARCOS_CA | indent 9}", 1)
			content = strings.Replace(content, "${NAVARCOS_CA}", "${NAVARCOS_CA | indent 11}", 1)
			return content
		}
	case DockerCapiPath:
		{
			content = strings.Replace(content, "${NAVARCOS_CA}", "${NAVARCOS_CA | indent 13}", 1)
			content = strings.Replace(content, "${NAVARCOS_CA}", "${NAVARCOS_CA | indent 11}", 1)
			return content
		}
	default:
		return content

	}
}

func substituteValues(content string, data map[string]string) (string, error) {

	content = strings.ReplaceAll(content, "${", "${.")
	manifestTemplate, err := template.New(uuid.New().String()).Delims("${", "}").Funcs(sprig.FuncMap()).Parse(content)
	if err != nil {
		return "", err
	}
	bytesBuffer := new(bytes.Buffer)
	if err = manifestTemplate.Execute(bytesBuffer, data); err != nil {
		return "", err
	}
	return bytesBuffer.String(), nil
}

func readFile(filePath string) (string, error) {
	content, err := os.ReadFile(filePath)
	if err != nil {
		return "", err
	}
	return string(content), nil
}
