package mapper

import (
	"github.com/activadigital/plancia/internal/api/dtos"
	"helm.sh/helm/v3/pkg/release"
)

func NewRelease(elem *release.Release) dtos.ReleaseDto {
	return dtos.ReleaseDto{
		Name:      elem.Name,
		Namespace: elem.Namespace,
		Chart:     elem.Chart.Name(),
		Version:   elem.Chart.AppVersion(),
		Status:    string(elem.Info.Status),
		Updated:   elem.Info.LastDeployed.Time,
		Values:    elem.Chart.Values,
	}
}
