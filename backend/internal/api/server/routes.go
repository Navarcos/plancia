package server

import (
	"github.com/Nerzal/gocloak/v13"
	_ "github.com/activadigital/plancia/docs"
	"github.com/activadigital/plancia/internal/api/handler"
	"github.com/activadigital/plancia/internal/api/server/middleware"
	"github.com/activadigital/plancia/internal/api/server/middleware/errors"
	"github.com/gorilla/mux"
	httpSwagger "github.com/swaggo/http-swagger/v2"
	"net/http"
	"net/http/pprof"
)

func (s *Application) setupRoutes(gocloakClient *gocloak.GoCloak) {
	authMiddleware := middleware.NewAuthMiddleware(gocloakClient)

	apiRouter := s.router.StrictSlash(true).PathPrefix("/api/v1").Subrouter()
	apiRouter.Use(middleware.Logger)
	apiRouter.Use(authMiddleware.ValidateToken)
	apiRouter.Use(errors.ErrorHandler)

	//Swagger
	s.router.PathPrefix("/swagger/").Handler(httpSwagger.Handler(
		httpSwagger.DeepLinking(true),
		httpSwagger.DocExpansion("none"),
		httpSwagger.DomID("swagger-ui"),
	)).Methods(http.MethodGet)

	// Skafos management
	apiRouter.HandleFunc("/skafos",
		handler.HandleGetSkafosList(s.skafosGetter)).Methods(http.MethodGet)

	apiRouter.HandleFunc("/namespaces/{namespace}/vsphereSkafos/{name}",
		handler.HandleGetVsphereSkafos(s.skafosGetter)).Methods(http.MethodGet)

	apiRouter.HandleFunc("/namespaces/{namespace}/dockerSkafos/{name}",
		handler.HandleGetDockerSkafos(s.skafosGetter)).Methods(http.MethodGet)

	apiRouter.HandleFunc("/vsphereSkafos",
		handler.HandleCreateVSphere(s.skafosCreator)).Methods(http.MethodPost)

	apiRouter.HandleFunc("/dockerSkafos",
		handler.HandleCreateDocker(s.skafosCreator)).Methods(http.MethodPost)

	apiRouter.HandleFunc("/namespaces/{namespace}/kubeadmcontrolplanes/{name}",
		handler.HandleScaleControlPlane(s.skafosPatcher)).Methods(http.MethodPatch)

	apiRouter.HandleFunc("/namespaces/{namespace}/machinedeployments/{name}",
		handler.HandleScaleMachineDeployment(s.skafosPatcher)).Methods(http.MethodPatch)

	apiRouter.HandleFunc("/namespaces/{namespace}/skafos/{name}",
		handler.HandleDeleteSkafos(s.skafosDeleter)).Methods(http.MethodDelete)

	apiRouter.HandleFunc("/externalClusters",
		handler.HandleClusterImport(s.clusterImporter)).Methods(http.MethodPost)

	apiRouter.HandleFunc("/externalClusters",
		handler.HandleGetExternalClusters(s.skafosGetter)).Methods(http.MethodGet)

	// Skafos Details
	apiRouter.HandleFunc("/namespaces/{namespace}/skafos/{name}/kubeconfig",
		handler.HandleGetKubeconfig(s.skafosGetter)).Methods(http.MethodGet)
	apiRouter.HandleFunc("/namespaces/{namespace}/skafos/{name}/discovery",
		handler.HandleApiDiscovery(s.skafosGetter)).Methods(http.MethodGet)
	apiRouter.HandleFunc("/namespaces/{namespace}/skafos/{name}/stats",
		handler.HandleGetSkafosStats(s.skafosGetter)).Methods(http.MethodGet)
	apiRouter.HandleFunc("/namespaces/{namespace}/skafos/{name}/metrics",
		handler.HandleGetMetrics(s.registry)).Methods(http.MethodGet)

	// generic resource
	apiRouter.HandleFunc("/namespaces/{skafosNamespace}/skafos/{skafosName}/resources",
		handler.HandleListGvr(s.registry)).Methods(http.MethodGet)
	apiRouter.HandleFunc("/namespaces/{skafosNamespace}/skafos/{skafosName}/namespaces/{resourceNamespace}/resources/{resourceName}",
		handler.HandleGetGvr(s.registry)).Methods(http.MethodGet)
	apiRouter.HandleFunc("/namespaces/{skafosNamespace}/skafos/{skafosName}/namespaces/{resourceNamespace}/resources/{resourceName}",
		handler.HandleDeleteGvr(s.registry)).Methods(http.MethodDelete)

	// events
	apiRouter.HandleFunc("/namespaces/{skafosNamespace}/skafos/{skafosName}/events",
		handler.HandleListEvents(s.registry)).Methods(http.MethodGet)

	// nodes
	apiRouter.HandleFunc("/namespaces/{skafosNamespace}/skafos/{skafosName}/nodes",
		handler.HandleListNodes(s.registry)).Methods(http.MethodGet)
	apiRouter.HandleFunc("/namespaces/{skafosNamespace}/skafos/{skafosName}/nodes/{resourceName}",
		handler.HandleGetNode(s.registry)).Methods(http.MethodGet)

	// pods
	apiRouter.HandleFunc("/namespaces/{skafosNamespace}/skafos/{skafosName}/pods",
		handler.HandleListPods(s.registry)).Methods(http.MethodGet)
	apiRouter.HandleFunc("/namespaces/{skafosNamespace}/skafos/{skafosName}/namespaces/{resourceNamespace}/pods/{resourceName}",
		handler.HandleGetPod(s.registry)).Methods(http.MethodGet)
	apiRouter.HandleFunc("/namespaces/{skafosNamespace}/skafos/{skafosName}/namespaces/{resourceNamespace}/pods/{resourceName}",
		handler.HandleDeletePod(s.registry)).Methods(http.MethodDelete)

	// deployments
	apiRouter.HandleFunc("/namespaces/{skafosNamespace}/skafos/{skafosName}/deployments",
		handler.HandleListDeployments(s.registry)).Methods(http.MethodGet)
	apiRouter.HandleFunc("/namespaces/{skafosNamespace}/skafos/{skafosName}/namespaces/{resourceNamespace}/deployments/{resourceName}",
		handler.HandleGetDeployment(s.registry)).Methods(http.MethodGet)
	apiRouter.HandleFunc("/namespaces/{skafosNamespace}/skafos/{skafosName}/namespaces/{resourceNamespace}/deployments/{resourceName}",
		handler.HandleDeleteDeployment(s.registry)).Methods(http.MethodDelete)

	// replicaSets
	apiRouter.HandleFunc("/namespaces/{skafosNamespace}/skafos/{skafosName}/replicaSets",
		handler.HandleListReplicaSets(s.registry)).Methods(http.MethodGet)
	apiRouter.HandleFunc("/namespaces/{skafosNamespace}/skafos/{skafosName}/namespaces/{resourceNamespace}/replicaSets/{resourceName}",
		handler.HandleGetReplicaSet(s.registry)).Methods(http.MethodGet)
	apiRouter.HandleFunc("/namespaces/{skafosNamespace}/skafos/{skafosName}/namespaces/{resourceNamespace}/replicaSets/{resourceName}",
		handler.HandleDeleteReplicaSet(s.registry)).Methods(http.MethodDelete)

	// statefulSets
	apiRouter.HandleFunc("/namespaces/{skafosNamespace}/skafos/{skafosName}/statefulSets",
		handler.HandleListStatefulSets(s.registry)).Methods(http.MethodGet)
	apiRouter.HandleFunc("/namespaces/{skafosNamespace}/skafos/{skafosName}/namespaces/{resourceNamespace}/statefulSets/{resourceName}",
		handler.HandleGetStatefulSet(s.registry)).Methods(http.MethodGet)
	apiRouter.HandleFunc("/namespaces/{skafosNamespace}/skafos/{skafosName}/namespaces/{resourceNamespace}/statefulSets/{resourceName}",
		handler.HandleDeleteStatefulSet(s.registry)).Methods(http.MethodDelete)

	// services
	apiRouter.HandleFunc("/namespaces/{skafosNamespace}/skafos/{skafosName}/services",
		handler.HandleListServices(s.registry)).Methods(http.MethodGet)
	apiRouter.HandleFunc("/namespaces/{skafosNamespace}/skafos/{skafosName}/namespaces/{resourceNamespace}/services/{resourceName}",
		handler.HandleGetService(s.registry)).Methods(http.MethodGet)
	apiRouter.HandleFunc("/namespaces/{skafosNamespace}/skafos/{skafosName}/namespaces/{resourceNamespace}/services/{resourceName}",
		handler.HandleDeleteService(s.registry)).Methods(http.MethodDelete)

	// ingresses
	apiRouter.HandleFunc("/namespaces/{skafosNamespace}/skafos/{skafosName}/ingresses",
		handler.HandleListIngresses(s.registry)).Methods(http.MethodGet)
	apiRouter.HandleFunc("/namespaces/{skafosNamespace}/skafos/{skafosName}/namespaces/{resourceNamespace}/ingresses/{resourceName}",
		handler.HandleGetIngress(s.registry)).Methods(http.MethodGet)
	apiRouter.HandleFunc("/namespaces/{skafosNamespace}/skafos/{skafosName}/namespaces/{resourceNamespace}/ingresses/{resourceName}",
		handler.HandleDeleteIngress(s.registry)).Methods(http.MethodDelete)

	// persistentVolumes
	apiRouter.HandleFunc("/namespaces/{skafosNamespace}/skafos/{skafosName}/persistentVolumes",
		handler.HandleListPersistentVolumes(s.registry)).Methods(http.MethodGet)
	apiRouter.HandleFunc("/namespaces/{skafosNamespace}/skafos/{skafosName}/persistentVolumes/{resourceName}",
		handler.HandleGetPersistentVolume(s.registry)).Methods(http.MethodGet)
	apiRouter.HandleFunc("/namespaces/{skafosNamespace}/skafos/{skafosName}/persistentVolumes/{resourceName}",
		handler.HandleDeletePersistentVolume(s.registry)).Methods(http.MethodDelete)

	// persistentVolumeClaims
	apiRouter.HandleFunc("/namespaces/{skafosNamespace}/skafos/{skafosName}/persistentVolumeClaims",
		handler.HandleListPersistentVolumeClaims(s.registry)).Methods(http.MethodGet)
	apiRouter.HandleFunc("/namespaces/{skafosNamespace}/skafos/{skafosName}/namespaces/{resourceNamespace}/persistentVolumeClaims/{resourceName}",
		handler.HandleGetPersistentVolumeClaim(s.registry)).Methods(http.MethodGet)
	apiRouter.HandleFunc("/namespaces/{skafosNamespace}/skafos/{skafosName}/namespaces/{resourceNamespace}/persistentVolumeClaims/{resourceName}",
		handler.HandleDeletePersistentVolumeClaim(s.registry)).Methods(http.MethodDelete)

	// configMaps
	apiRouter.HandleFunc("/namespaces/{skafosNamespace}/skafos/{skafosName}/configMaps",
		handler.HandleListConfigMaps(s.registry)).Methods(http.MethodGet)
	apiRouter.HandleFunc("/namespaces/{skafosNamespace}/skafos/{skafosName}/namespaces/{resourceNamespace}/configMaps/{resourceName}",
		handler.HandleGetConfigMap(s.registry)).Methods(http.MethodGet)
	apiRouter.HandleFunc("/namespaces/{skafosNamespace}/skafos/{skafosName}/namespaces/{resourceNamespace}/configMaps/{resourceName}",
		handler.HandleDeleteConfigMap(s.registry)).Methods(http.MethodDelete)

	// secrets
	apiRouter.HandleFunc("/namespaces/{skafosNamespace}/skafos/{skafosName}/secrets",
		handler.HandleListSecrets(s.registry)).Methods(http.MethodGet)
	apiRouter.HandleFunc("/namespaces/{skafosNamespace}/skafos/{skafosName}/namespaces/{resourceNamespace}/secrets/{resourceName}",
		handler.HandleGetSecret(s.registry)).Methods(http.MethodGet)
	apiRouter.HandleFunc("/namespaces/{skafosNamespace}/skafos/{skafosName}/namespaces/{resourceNamespace}/secrets/{resourceName}",
		handler.HandleDeleteSecret(s.registry)).Methods(http.MethodDelete)

	apiRouter.HandleFunc("/namespaces/{skafosNamespace}/skafos/{skafosName}/releases",
		handler.HandleListReleases(s.registry)).Methods(http.MethodGet)

	// profiling
	addProfileRoutes(s.router)
}

func addProfileRoutes(router *mux.Router) {
	router.Handle("/debug/pprof/", http.HandlerFunc(pprof.Index))
	router.Handle("/debug/pprof/cmdline", http.HandlerFunc(pprof.Cmdline))
	router.Handle("/debug/pprof/profile", http.HandlerFunc(pprof.Profile))
	router.Handle("/debug/pprof/symbol", http.HandlerFunc(pprof.Symbol))
	router.Handle("/debug/pprof/trace", http.HandlerFunc(pprof.Trace))
	router.Handle("/debug/pprof/{cmd}", http.HandlerFunc(pprof.Index))
}
