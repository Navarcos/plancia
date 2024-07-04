package handler

import (
	"encoding/json"
	"github.com/activadigital/plancia/internal/api/server/httpjson"
	"github.com/activadigital/plancia/internal/usecase"
	"github.com/gorilla/mux"
	"net/http"
)

// HandleClusterImport
// @Summary import cluster kubeconfig
// @ID import-cluster
// @Tags Cluster
// @Produce text/plain
// @Param namespace path string true "namespace"
// @Param clusterName path string true "clusterName"
// @QueryParam provider path string true "provider name"
// @Success 200 {object} string
// @Failure 500 {object} dtos.ProblemDetails
// @Router /skafos/namespaces/{namespace}/cluster/{clusterName}/provider/{provider}/import [post]
func HandleClusterImport(service usecase.ClusterUsecase) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		namespace := mux.Vars(r)["namespace"]
		clusterName := mux.Vars(r)["name"]
		provider := r.URL.Query().Get("provider")
		var dataIn []byte
		err := json.NewDecoder(r.Body).Decode(&dataIn)
		if err != nil {
			setErrorInRequestContext(r, err)
			return
		}
		err = service.ImportCluster(r.Context(), dataIn, provider, namespace, clusterName)
		if err != nil {
			setErrorInRequestContext(r, err)
			return
		}
		_ = httpjson.Encode(w, r, http.StatusOK, struct{}{})
	}
}

func HandleGetNamespaces(service usecase.ClusterUsecase) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

	}
}
