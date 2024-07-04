package handler

import (
	_ "github.com/activadigital/plancia/internal/api/dtos"
	"github.com/activadigital/plancia/internal/api/server/httpjson"
	"github.com/activadigital/plancia/internal/domain/skafos/client"
	"github.com/activadigital/plancia/internal/usecase/resource"
	_ "k8s.io/api/apps/v1"
	"net/http"
)

// HandleListReplicaSets
// @Summary list skafos replicaSets
// @ID list-skafos-replicaSets
// @Tags ReplicaSets
// @Produce application/json
// @Param skafosNamespace path string true "skafos namespace"
// @Param skafosName path string true "skafos name"
// @Param resourceNamespace query string true "resource namespace"
// @Success 200 {object} v1.ReplicaSetList
// @Failure 500 {object} dtos.ProblemDetails
// @Router /namespaces/{skafosNamespace}/skafos/{skafosName}/replicaSets [get]
func HandleListReplicaSets(registry client.SkafosRegistry) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		param := apiParams(request)
		resourceNamespace := request.URL.Query().Get("resourceNamespace")
		param.ResourceNamespace = resourceNamespace
		list, err := resource.ListReplicaSets(request.Context(), registry, param)
		if err != nil {
			setErrorInRequestContext(request, err)
			return
		}
		_ = httpjson.Encode(writer, request, http.StatusOK, list)
	}
}

// HandleGetReplicaSet
// @Summary get replicaSet
// @ID get-skafos-replicaSet
// @Tags ReplicaSets
// @Produce application/json
// @Param skafosNamespace path string true "skafos namespace"
// @Param skafosName path string true "skafos name"
// @Param resourceNamespace path string true "resource namespace"
// @Param resourceName path string true "resource name"
// @Success 200 {object} v1.ReplicaSet
// @Failure 404 {object} dtos.ProblemDetails
// @Failure 500 {object} dtos.ProblemDetails
// @Router /namespaces/{skafosNamespace}/skafos/{skafosName}/namespaces/{resourceNamespace}/replicaSets/{resourceName} [get]
func HandleGetReplicaSet(registry client.SkafosRegistry) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		param := apiParams(request)
		result, err := resource.GetReplicaSet(request.Context(), registry, param)
		if err != nil {
			setErrorInRequestContext(request, err)
			return
		}
		_ = httpjson.Encode(writer, request, http.StatusOK, result)
	}
}

// HandleDeleteReplicaSet
// @Summary delete skafos replicaSet
// @ID delete-skafos-replicaSet
// @Tags ReplicaSets
// @Produce application/json
// @Param skafosNamespace path string true "skafos namespace"
// @Param skafosName path string true "skafos name"
// @Param resourceNamespace path string true "resource namespace"
// @Param resourceName path string true "resource name"
// @Success 200
// @Failure 404 {object} dtos.ProblemDetails
// @Failure 500 {object} dtos.ProblemDetails
// @Router /namespaces/{skafosNamespace}/skafos/{skafosName}/namespaces/{resourceNamespace}/replicaSets/{resourceName} [delete]
func HandleDeleteReplicaSet(registry client.SkafosRegistry) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		param := apiParams(request)
		err := resource.DeleteReplicaSet(request.Context(), registry, param)
		if err != nil {
			setErrorInRequestContext(request, err)
			return
		}
		_ = httpjson.Encode(writer, request, http.StatusOK, struct{}{})
	}
}
