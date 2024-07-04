package handler

import (
	_ "github.com/activadigital/plancia/internal/api/dtos"
	"github.com/activadigital/plancia/internal/api/server/httpjson"
	"github.com/activadigital/plancia/internal/domain/skafos/client"
	"github.com/activadigital/plancia/internal/usecase/resource"
	"net/http"
)

// HandleListGvr
// @Summary list skafos resource from groupVersionResource
// @ID list-skafos-gvr
// @Tags Generic Resource
// @Produce application/json
// @Param skafosNamespace path string true "skafos namespace"
// @Param skafosName path string true "skafos name"
// @Param resourceNamespace query string true "resource namespace"
// @Param group query string false "resource group"
// @Param version query string true "resource version"
// @Param resource query string true "resource name"
// @Success 200 {object} unstructured.UnstructuredList
// @Failure 500 {object} dtos.ProblemDetails
// @Router /namespaces/{skafosNamespace}/skafos/{skafosName}/resources [get]
func HandleListGvr(registry client.SkafosRegistry) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		param := apiParams(request)
		gvr := parseGvr(request)
		resourceNamespace := request.URL.Query().Get("resourceNamespace")
		param.ResourceNamespace = resourceNamespace
		list, err := resource.ListGvr(request.Context(), registry, gvr, param)
		if err != nil {
			setErrorInRequestContext(request, err)
			return
		}
		_ = httpjson.Encode(writer, request, http.StatusOK, list)
	}
}

// HandleGetGvr
// @Summary get skafos resource from groupVersionResource
// @ID get-skafos-gvr
// @Tags Generic Resource
// @Produce application/json
// @Param skafosNamespace path string true "skafos namespace"
// @Param skafosName path string true "skafos name"
// @Param resourceNamespace path string true "resource namespace"
// @Param resourceName path string true "resource name"
// @Param group query string false "resource group"
// @Param version query string true "resource version"
// @Param resource query string true "resource name"
// @Success 200 {object} unstructured.Unstructured
// @Failure 404 {object} dtos.ProblemDetails
// @Failure 500 {object} dtos.ProblemDetails
// @Router /namespaces/{skafosNamespace}/skafos/{skafosName}/namespaces/{resourceNamespace}/resources/{resourceName} [get]
func HandleGetGvr(registry client.SkafosRegistry) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		param := apiParams(request)
		gvr := parseGvr(request)
		result, err := resource.GetGvr(request.Context(), registry, gvr, param)
		if err != nil {
			setErrorInRequestContext(request, err)
			return
		}
		_ = httpjson.Encode(writer, request, http.StatusOK, result)
	}
}

// HandleDeleteGvr
// @Summary delete skafos resource from groupVersionResource
// @ID delete-skafos-gvr
// @Tags Generic Resource
// @Produce application/json
// @Param skafosNamespace path string true "skafos namespace"
// @Param skafosName path string true "skafos name"
// @Param resourceNamespace path string true "resource namespace"
// @Param resourceName path string true "resource name"
// @Param group query string false "resource group"
// @Param version query string true "resource version"
// @Param resource query string true "resource name"
// @Success 200
// @Failure 404 {object} dtos.ProblemDetails
// @Failure 500 {object} dtos.ProblemDetails
// @Router /namespaces/{skafosNamespace}/skafos/{skafosName}/namespaces/{resourceNamespace}/resources/{resourceName} [delete]
func HandleDeleteGvr(registry client.SkafosRegistry) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		param := apiParams(request)
		gvr := parseGvr(request)
		err := resource.DeleteGvr(request.Context(), registry, gvr, param)
		if err != nil {
			setErrorInRequestContext(request, err)
			return
		}
		_ = httpjson.Encode(writer, request, http.StatusOK, struct{}{})
	}
}
