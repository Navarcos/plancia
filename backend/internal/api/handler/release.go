package handler

import (
	_ "github.com/activadigital/plancia/internal/api/dtos"
	"github.com/activadigital/plancia/internal/api/mapper"
	"github.com/activadigital/plancia/internal/api/server/httpjson"
	"github.com/activadigital/plancia/internal/domain/skafos/client"
	"github.com/activadigital/plancia/internal/domain/skafos/helm"
	"github.com/activadigital/plancia/internal/util"
	"net/http"
)

// HandleListReleases
// @Summary list skafos releases
// @ID list-skafos-releases
// @Tags Helm Release
// @Produce application/json
// @Param skafosNamespace path string true "skafos namespace"
// @Param skafosName path string true "skafos name"
// @Param resourceNamespace query string true "resource namespace"
// @Success 200 {object} dtos.ReleaseDto
// @Failure 500 {object} dtos.ProblemDetails
// @Router /namespaces/{skafosNamespace}/skafos/{skafosName}/releases [get]
func HandleListReleases(registry client.SkafosRegistry) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		param := apiParams(request)
		resourceNamespace := request.URL.Query().Get("resourceNamespace")
		skafosClient, err := registry.Get(request.Context(), param.SkafosNamespace, param.SkafosName)
		if err != nil {
			setErrorInRequestContext(request, err)
			return
		}
		releaseList, err := helm.List(request.Context(), skafosClient.GetKubeconfig(), resourceNamespace)
		if err != nil {
			setErrorInRequestContext(request, err)
			return
		}
		result := util.Map(releaseList, mapper.NewRelease)
		_ = httpjson.Encode(writer, request, http.StatusOK, result)
	}
}
