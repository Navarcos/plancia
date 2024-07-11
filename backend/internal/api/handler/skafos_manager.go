package handler

import (
	"github.com/activadigital/plancia/configs/logger"
	"github.com/activadigital/plancia/internal/api/dtos"
	"github.com/activadigital/plancia/internal/api/mapper"
	"github.com/activadigital/plancia/internal/api/server/httpjson"
	"github.com/activadigital/plancia/internal/domain/apperror"
	"github.com/activadigital/plancia/internal/domain/types"
	"github.com/activadigital/plancia/internal/usecase/skafos"
	"github.com/activadigital/plancia/internal/util"
	"github.com/gorilla/mux"
	"go.uber.org/zap"
	"k8s.io/apimachinery/pkg/apis/meta/v1/unstructured"
	"net/http"
	"sort"
	"strconv"
)

// HandleGetSkafosList
// @Summary get all skafos
// @ID get-all-skafos
// @Tags Skafos
// @Produce application/json
// @Param namespace query string true "namespace"
// @Success 200 {object} []dtos.GetSkafosListResponse
// @Failure 500 {object} dtos.ProblemDetails
// @Router /skafos/ [get]
func HandleGetSkafosList(getter skafos.Getter) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		namespace := request.URL.Query().Get("namespace")
		skafosList, err := getter.GetSkafosList(request.Context(), namespace)
		if err != nil {
			setErrorInRequestContext(request, err)
			return
		}
		response := util.Map[types.Skafos, dtos.GetSkafosListResponse](skafosList, mapper.NewGetSkafosListResponse)
		sort.Slice(response, func(i, j int) bool {
			return response[i].Name < response[j].Name
		})
		_ = httpjson.Encode(writer, request, http.StatusOK, response)
	}
}

// HandleGetVsphereSkafos
// @Summary get vsphere skafos by name
// @ID get-vsphere-skafos
// @Tags VsphereSkafos
// @Produce application/json
// @Param namespace path string true "namespace"
// @Param name path string true "name"
// @Success 200 {object} dtos.GetSkafosResponse
// @Failure 404 {object} dtos.ProblemDetails
// @Failure 500 {object} dtos.ProblemDetails
// @Router /namespaces/{namespace}/vsphereSkafos/{name} [get]
func HandleGetVsphereSkafos(getter skafos.Getter) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		namespace := mux.Vars(request)["namespace"]
		name := mux.Vars(request)["name"]
		if namespace == "" {
			err := apperror.NewValidationError("missing namespace request parameter")
			setErrorInRequestContext(request, err)
			return
		}
		vsphereSkafos, err := getter.GetVsphereSkafos(request.Context(), name, namespace)
		if err != nil {
			setErrorInRequestContext(request, err)
			return
		}
		response := mapper.NewGetVsphereSkafosResponse(vsphereSkafos)
		_ = httpjson.Encode(writer, request, http.StatusOK, response)
	}
}

// HandleGetDockerSkafos
// @Summary get docker skafos by name
// @ID get-docker-skafos
// @Tags DockerSkafos
// @Produce application/json
// @Param namespace path string true "namespace"
// @Param name path string true "name"
// @Success 200 {object} dtos.GetSkafosResponse
// @Failure 404 {object} dtos.ProblemDetails
// @Failure 500 {object} dtos.ProblemDetails
// @Router /namespaces/{namespace}/vsphereSkafos/{name} [get]
func HandleGetDockerSkafos(getter skafos.Getter) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		namespace := mux.Vars(request)["namespace"]
		name := mux.Vars(request)["name"]
		if namespace == "" {
			err := apperror.NewValidationError("missing namespace request parameter")
			setErrorInRequestContext(request, err)
			return
		}
		vsphereSkafos, err := getter.GetDockerSkafos(request.Context(), name, namespace)
		if err != nil {
			setErrorInRequestContext(request, err)
			return
		}
		response := mapper.NewGetDockerSkafosResponse(vsphereSkafos)
		_ = httpjson.Encode(writer, request, http.StatusOK, response)
	}
}

// HandleCreateVSphere
// @Summary create vsphereSkafos
// @ID create-vsphere-skafos
// @Tags VsphereSkafos
// @Accept application/json
// @Param createVsphereRequest body dtos.CreateVsphereRequest true "vsphere skafos creation request"
// @Success 202
// @Failure 400 {object} dtos.ProblemDetails
// @Failure 500 {object} dtos.ProblemDetails
// @Router /vsphereSkafos [post]
func HandleCreateVSphere(creator skafos.Creator) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		createRequest, err := httpjson.DecodeValid[dtos.CreateVsphereRequest](request)
		if err != nil {
			setErrorInRequestContext(request, err)
			return
		}
		vsphereSkafos := mapper.NewVSphereSkafos(createRequest)
		if err = creator.CreateSkafos(request.Context(), vsphereSkafos); err != nil {
			setErrorInRequestContext(request, err)
			return
		}
		_ = httpjson.Encode(writer, request, http.StatusAccepted, struct{}{})
	}
}

// HandleCreateDocker
// @Summary create dockerSkafos
// @ID create-docker-skafos
// @Tags DockerSkafos
// @Accept application/json
// @Param createDockerRequest body dtos.CreateDockerRequest true "docker skafos creation request"
// @Success 202
// @Failure 400 {object} dtos.ProblemDetails
// @Failure 500 {object} dtos.ProblemDetails
// @Router /dockerSkafos [post]
func HandleCreateDocker(creator skafos.Creator) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		createRequest, err := httpjson.DecodeValid[dtos.CreateDockerRequest](request)
		if err != nil {
			setErrorInRequestContext(request, err)
			return
		}
		dockerSkafos := mapper.NewDockerSkafos(createRequest)
		if err = creator.CreateSkafos(request.Context(), dockerSkafos); err != nil {
			setErrorInRequestContext(request, err)
			return
		}
		_ = httpjson.Encode(writer, request, http.StatusAccepted, struct{}{})
	}
}

// HandleScaleControlPlane
// @Summary patch vsphereSkafos
// @ID scale-controlplane
// @Tags Skafos
// @Accept application/json
// @Param namespace path string true "namespace"
// @Param name path string true "kubeadmControlplane name"
// @Success 202
// @Failure 400 {object} dtos.ProblemDetails
// @Failure 404 {object} dtos.ProblemDetails
// @Failure 500 {object} dtos.ProblemDetails
// @Failure 503 {object} dtos.ProblemDetails
// @Router /namespaces/{namespace}/kubeadmControlplane/{name} [patch]
func HandleScaleControlPlane(patcher skafos.Patcher) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		namespace := mux.Vars(request)["namespace"]
		name := mux.Vars(request)["name"]
		nodes := request.URL.Query().Get("nodes")
		if nodes == "" {
			err := apperror.NewValidationError("missing nodes request parameter")
			setErrorInRequestContext(request, err)
			return
		}
		nodeNumber, err := strconv.Atoi(nodes)
		if err != nil {
			err = apperror.NewValidationError(err.Error())
			setErrorInRequestContext(request, err)
			return
		}
		patch := mapper.NewPatch(name, namespace, int32(nodeNumber))
		if err = patcher.PatchControlPlane(request.Context(), patch); err != nil {
			setErrorInRequestContext(request, err)
			return
		}
		_ = httpjson.Encode(writer, request, http.StatusAccepted, struct{}{})
	}
}

// HandleScaleMachineDeployment
// @Summary patch vsphereSkafos
// @ID scale-machine-deployment
// @Tags Skafos
// @Accept json
// @Produce json
// @Param namespace path string true "namespace"
// @Param name path string true "machine deployment name"
// @Success 202
// @Failure 400 {object} dtos.ProblemDetails
// @Failure 404 {object} dtos.ProblemDetails
// @Failure 500 {object} dtos.ProblemDetails
// @Failure 503 {object} dtos.ProblemDetails
// @Router /namespaces/{namespace}/machineDeployment/{name} [patch]
func HandleScaleMachineDeployment(patcher skafos.Patcher) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		namespace := mux.Vars(request)["namespace"]
		name := mux.Vars(request)["name"]
		nodes := request.URL.Query().Get("nodes")
		if nodes == "" {
			err := apperror.NewValidationError("missing nodes request parameter")
			setErrorInRequestContext(request, err)
			return
		}
		nodeNumber, err := strconv.Atoi(nodes)
		if err != nil {
			err = apperror.NewValidationError(err.Error())
			setErrorInRequestContext(request, err)
			return
		}
		patch := mapper.NewPatch(name, namespace, int32(nodeNumber))
		if err = patcher.PatchMachineDeployment(request.Context(), patch); err != nil {
			setErrorInRequestContext(request, err)
			return
		}
		_ = httpjson.Encode(writer, request, http.StatusAccepted, struct{}{})
	}
}

// HandleDeleteSkafos
// @Summary delete skafos
// @ID delete-skafos
// @Tags Skafos
// @Accept json
// @Produce json
// @Param namespace path string true "namespace"
// @Param name path string true "skafos name"
// @Success 202
// @Failure 404 {object} dtos.ProblemDetails
// @Failure 500 {object} dtos.ProblemDetails
// @Router /namespaces/{namespace}/skafos/{name} [delete]
func HandleDeleteSkafos(deleter skafos.Cleaner) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		namespace := mux.Vars(request)["namespace"]
		name := mux.Vars(request)["name"]
		if err := deleter.Clean(request.Context(), namespace, name); err != nil {
			setErrorInRequestContext(request, err)
			return
		}
		_ = httpjson.Encode(writer, request, http.StatusAccepted, struct{}{})
	}
}

// HandleClusterImport
// @Summary import cluster kubeconfig
// @ID import-cluster
// @Tags ExternalCluster
// @Accept application/json
// @Success 200
// @Failure 500 {object} dtos.ProblemDetails
// @Router /externalClusters [post]
func HandleClusterImport(importer skafos.ClusterImporter) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		importRequest, err := httpjson.DecodeValid[dtos.ExternalClusterDto](r)
		if err != nil {
			logger.Error(r.Context(), "error importing cluster", zap.Error(err))
			setErrorInRequestContext(r, err)
			return
		}
		externalCluster := mapper.NewExternalCluster(importRequest)
		err = importer.Import(r.Context(), externalCluster)
		if err != nil {
			setErrorInRequestContext(r, err)
			return
		}
		_ = httpjson.Encode(w, r, http.StatusOK, struct{}{})
	}
}

// HandleGetExternalClusters
// @Summary get external clusters
// @ID get-external-clusters
// @Tags
// @Produce text/plain
// @Param namespace path string true "namespace"
// @Param clusterName path string true "clusterName"
// @QueryParam provider path string true "provider name"
// @Success 200
// @Failure 500 {object} dtos.ProblemDetails
// @Router /externalClusters [get]
func HandleGetExternalClusters(getter skafos.Getter) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		namespace := request.URL.Query().Get("namespace")
		kubeconfigs, err := getter.GetExternalClusters(request.Context(), namespace)
		if err != nil {
			setErrorInRequestContext(request, err)
			return
		}
		response := util.Map[unstructured.Unstructured, dtos.ExternalClusterDto](kubeconfigs.Items, mapper.NewExternalClusterDto)
		_ = httpjson.Encode(writer, request, http.StatusOK, response)

	}
}
