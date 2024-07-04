package handler

import (
	_ "github.com/activadigital/plancia/internal/api/dtos"
	"github.com/activadigital/plancia/internal/api/server/httpjson"
	"github.com/activadigital/plancia/internal/domain/skafos/client"
	"github.com/activadigital/plancia/internal/usecase/resource"
	_ "k8s.io/api/networking/v1"
	"net/http"
)

// HandleListIngresses
// @Summary list skafos ingresses
// @ID list-skafos-ingresses
// @Tags Ingresses
// @Produce application/json
// @Param skafosNamespace path string true "skafos namespace"
// @Param skafosName path string true "skafos name"
// @Param resourceNamespace query string true "resource namespace"
// @Success 200 {object} v1.IngressList
// @Failure 500 {object} dtos.ProblemDetails
// @Router /namespaces/{skafosNamespace}/skafos/{skafosName}/ingresses [get]
func HandleListIngresses(registry client.SkafosRegistry) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		param := apiParams(request)
		resourceNamespace := request.URL.Query().Get("resourceNamespace")
		param.ResourceNamespace = resourceNamespace
		list, err := resource.ListIngresses(request.Context(), registry, param)
		if err != nil {
			setErrorInRequestContext(request, err)
			return
		}
		_ = httpjson.Encode(writer, request, http.StatusOK, list)
	}
}

// HandleGetIngress
// @Summary get ingress
// @ID get-skafos-ingress
// @Tags Ingresses
// @Produce application/json
// @Param skafosNamespace path string true "skafos namespace"
// @Param skafosName path string true "skafos name"
// @Param resourceNamespace path string true "resource namespace"
// @Param resourceName path string true "resource name"
// @Success 200 {object} v1.Ingress
// @Failure 404 {object} dtos.ProblemDetails
// @Failure 500 {object} dtos.ProblemDetails
// @Router /namespaces/{skafosNamespace}/skafos/{skafosName}/namespaces/{resourceNamespace}/ingresses/{resourceName} [get]
func HandleGetIngress(registry client.SkafosRegistry) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		param := apiParams(request)
		result, err := resource.GetIngress(request.Context(), registry, param)
		if err != nil {
			setErrorInRequestContext(request, err)
			return
		}
		_ = httpjson.Encode(writer, request, http.StatusOK, result)
	}
}

// HandleDeleteIngress
// @Summary delete skafos ingress
// @ID delete-skafos-ingress
// @Tags Ingresses
// @Produce application/json
// @Param skafosNamespace path string true "skafos namespace"
// @Param skafosName path string true "skafos name"
// @Param resourceNamespace path string true "resource namespace"
// @Param resourceName path string true "resource name"
// @Success 200
// @Failure 404 {object} dtos.ProblemDetails
// @Failure 500 {object} dtos.ProblemDetails
// @Router /namespaces/{skafosNamespace}/skafos/{skafosName}/namespaces/{resourceNamespace}/ingresses/{resourceName} [delete]
func HandleDeleteIngress(registry client.SkafosRegistry) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		param := apiParams(request)
		err := resource.DeleteIngress(request.Context(), registry, param)
		if err != nil {
			setErrorInRequestContext(request, err)
			return
		}
		_ = httpjson.Encode(writer, request, http.StatusOK, struct{}{})
	}
}
