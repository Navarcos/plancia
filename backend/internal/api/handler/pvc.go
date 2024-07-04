package handler

import (
	_ "github.com/activadigital/plancia/internal/api/dtos"
	"github.com/activadigital/plancia/internal/api/server/httpjson"
	"github.com/activadigital/plancia/internal/domain/skafos/client"
	"github.com/activadigital/plancia/internal/usecase/resource"
	_ "k8s.io/api/core/v1"

	"net/http"
)

// HandleListPersistentVolumeClaims
// @Summary list skafos persistentVolumeClaims
// @ID list-skafos-persistentVolumeClaims
// @Tags PersistentVolumeClaims
// @Produce application/json
// @Param skafosNamespace path string true "skafos namespace"
// @Param skafosName path string true "skafos name"
// @Param resourceNamespace query string true "resource namespace"
// @Success 200 {object} v1.PersistentVolumeClaimList
// @Failure 500 {object} dtos.ProblemDetails
// @Router /namespaces/{skafosNamespace}/skafos/{skafosName}/persistentVolumeClaims [get]
func HandleListPersistentVolumeClaims(registry client.SkafosRegistry) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		param := apiParams(request)
		resourceNamespace := request.URL.Query().Get("resourceNamespace")
		param.ResourceNamespace = resourceNamespace
		list, err := resource.ListPersistentVolumeClaims(request.Context(), registry, param)
		if err != nil {
			setErrorInRequestContext(request, err)
			return
		}
		_ = httpjson.Encode(writer, request, http.StatusOK, list)
	}
}

// HandleGetPersistentVolumeClaim
// @Summary get persistentVolumeClaim
// @ID get-skafos-persistentVolumeClaim
// @Tags PersistentVolumeClaims
// @Produce application/json
// @Param skafosNamespace path string true "skafos namespace"
// @Param skafosName path string true "skafos name"
// @Param resourceNamespace path string true "resource namespace"
// @Param resourceName path string true "resource name"
// @Success 200 {object} v1.PersistentVolumeClaim
// @Failure 404 {object} dtos.ProblemDetails
// @Failure 500 {object} dtos.ProblemDetails
// @Router /namespaces/{skafosNamespace}/skafos/{skafosName}/namespaces/{resourceNamespace}/persistentVolumeClaims/{resourceName} [get]
func HandleGetPersistentVolumeClaim(registry client.SkafosRegistry) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		param := apiParams(request)
		result, err := resource.GetPersistentVolumeClaim(request.Context(), registry, param)
		if err != nil {
			setErrorInRequestContext(request, err)
			return
		}
		_ = httpjson.Encode(writer, request, http.StatusOK, result)
	}
}

// HandleDeletePersistentVolumeClaim
// @Summary delete skafos persistentVolumeClaim
// @ID delete-skafos-persistentVolumeClaim
// @Tags PersistentVolumeClaims
// @Produce application/json
// @Param skafosNamespace path string true "skafos namespace"
// @Param skafosName path string true "skafos name"
// @Param resourceNamespace path string true "resource namespace"
// @Param resourceName path string true "resource name"
// @Success 200
// @Failure 404 {object} dtos.ProblemDetails
// @Failure 500 {object} dtos.ProblemDetails
// @Router /namespaces/{skafosNamespace}/skafos/{skafosName}/namespaces/{resourceNamespace}/persistentVolumeClaims/{resourceName} [delete]
func HandleDeletePersistentVolumeClaim(registry client.SkafosRegistry) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		param := apiParams(request)
		err := resource.DeletePersistentVolumeClaim(request.Context(), registry, param)
		if err != nil {
			setErrorInRequestContext(request, err)
			return
		}
		_ = httpjson.Encode(writer, request, http.StatusOK, struct{}{})
	}
}
