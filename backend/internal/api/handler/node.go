package handler

import (
	_ "github.com/activadigital/plancia/internal/api/dtos"
	"github.com/activadigital/plancia/internal/api/server/httpjson"
	"github.com/activadigital/plancia/internal/domain/skafos/client"
	"github.com/activadigital/plancia/internal/usecase/resource"
	"net/http"
)

// HandleListNodes
// @Summary list skafos nodes
// @ID list-skafos-nodes
// @Tags Nodes
// @Produce application/json
// @Param skafosNamespace path string true "skafos namespace"
// @Param skafosName path string true "skafos name"
// @Param resourceNamespace query string true "resource namespace"
// @Success 200 {object} v1.NodeList
// @Failure 500 {object} dtos.ProblemDetails
// @Router /namespaces/{skafosNamespace}/skafos/{skafosName}/nodes [get]
func HandleListNodes(registry client.SkafosRegistry) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		param := apiParams(request)
		resourceNamespace := request.URL.Query().Get("resourceNamespace")
		param.ResourceNamespace = resourceNamespace
		list, err := resource.ListNodes(request.Context(), registry, param)
		if err != nil {
			setErrorInRequestContext(request, err)
			return
		}
		_ = httpjson.Encode(writer, request, http.StatusOK, list)
	}
}

// HandleGetNode
// @Summary get node
// @ID get-skafos-node
// @Tags Nodes
// @Produce application/json
// @Param skafosNamespace path string true "skafos namespace"
// @Param skafosName path string true "skafos name"
// @Param resourceNamespace path string true "resource namespace"
// @Param resourceName path string true "resource name"
// @Success 200 {object} v1.Node
// @Failure 404 {object} dtos.ProblemDetails
// @Failure 500 {object} dtos.ProblemDetails
// @Router /namespaces/{skafosNamespace}/skafos/{skafosName}/namespaces/{resourceNamespace}/nodes/{resourceName} [get]
func HandleGetNode(registry client.SkafosRegistry) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		param := apiParams(request)
		result, err := resource.GetNode(request.Context(), registry, param)
		if err != nil {
			setErrorInRequestContext(request, err)
			return
		}
		_ = httpjson.Encode(writer, request, http.StatusOK, result)
	}
}
