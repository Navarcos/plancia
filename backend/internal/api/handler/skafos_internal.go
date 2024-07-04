package handler

import (
	_ "github.com/activadigital/plancia/internal/api/dtos"
	"github.com/activadigital/plancia/internal/api/server/httpjson"
	"github.com/activadigital/plancia/internal/domain/apperror"
	"github.com/activadigital/plancia/internal/domain/skafos/client"
	"github.com/activadigital/plancia/internal/usecase/resource"
	"github.com/activadigital/plancia/internal/usecase/skafos"
	"github.com/gorilla/mux"
	"gopkg.in/yaml.v3"
	_ "k8s.io/api/core/v1"
	"net/http"
)

// HandleGetKubeconfig
// @Summary get skafos kubeconfig
// @ID get-skafos-kubeconfig
// @Tags SkafosDetail
// @Produce text/plain
// @Param namespace path string true "namespace"
// @Param name path string true "skafos name"
// @Success 200 {object} map[string]interface{}
// @Failure 500 {object} dtos.ProblemDetails
// @Router /namespaces/{namespace}/skafos/{name}/kubeconfig [get]
func HandleGetKubeconfig(getter skafos.Getter) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		namespace := mux.Vars(request)["namespace"]
		name := mux.Vars(request)["name"]
		kubeconfig, err := getter.GetKubeconfig(request.Context(), namespace, name)
		if err != nil {
			setErrorInRequestContext(request, err)
			return
		}
		result := map[string]interface{}{}
		err = yaml.Unmarshal(kubeconfig, result)
		if err != nil {
			setErrorInRequestContext(request, apperror.NewInternalError(err))
			return
		}
		_ = httpjson.Encode(writer, request, http.StatusOK, result)
	}
}

// HandleGetMetrics
// @Summary get skafos metrics
// @ID get-skafos-metrics
// @Tags SkafosDetail
// @Produce application/json
// @Param namespace path string true "namespace"
// @Param name path string true "skafos name"
// @Success 200 {object} dtos.SkafosMetrics
// @Failure 500 {object} dtos.ProblemDetails
// @Router /namespaces/{namespace}/skafos/{name}/metrics [get]
func HandleGetMetrics(registry client.SkafosRegistry) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		namespace := mux.Vars(request)["namespace"]
		name := mux.Vars(request)["name"]
		metrics, err := resource.GetMetrics(request.Context(), registry, namespace, name)
		if err != nil {
			setErrorInRequestContext(request, err)
			return
		}
		_ = httpjson.Encode(writer, request, http.StatusOK, metrics)
	}
}

// HandleGetSkafosStats
// @Summary get skafos resource status
// @ID get-skafos-stats
// @Tags SkafosDetail
// @Produce application/json
// @Param namespace path string true "namespace"
// @Param name path string true "skafos name"
// @Success 200 {object} dtos.ResourceOverview
// @Failure 500 {object} dtos.ProblemDetails
// @Router /namespaces/{namespace}/skafos/{name}/stats [get]
func HandleGetSkafosStats(getter skafos.Getter) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		ctx := request.Context()
		namespace := mux.Vars(request)["namespace"]
		name := mux.Vars(request)["name"]
		result, err := getter.GetSkafosStats(ctx, namespace, name)
		if err != nil {
			setErrorInRequestContext(request, err)
			return
		}
		_ = httpjson.Encode(writer, request, http.StatusOK, result)
	}
}

func HandleApiDiscovery(getter skafos.Getter) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		namespaces := mux.Vars(request)["namespace"]
		name := mux.Vars(request)["name"]
		apiList, err := getter.ApiDiscovery(request.Context(), namespaces, name)
		if err != nil {
			setErrorInRequestContext(request, err)
			return
		}
		gvkList := toGvrList(apiList)
		_ = httpjson.Encode(writer, request, http.StatusOK, gvkList)
	}
}
