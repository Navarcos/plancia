package handler

import (
	"github.com/activadigital/plancia/internal/usecase/resource"
	"github.com/gorilla/mux"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime/schema"
	"net/http"
	"strconv"
	"strings"
)

func parseGvr(request *http.Request) schema.GroupVersionResource {
	return schema.GroupVersionResource{
		Group:    request.URL.Query().Get("group"),
		Version:  request.URL.Query().Get("version"),
		Resource: request.URL.Query().Get("resource"),
	}
}

func apiParams(request *http.Request) resource.ApiParams {
	limitString := request.URL.Query().Get("limit")
	limit, err := strconv.Atoi(limitString)
	if err != nil {
		limit = 0
	}
	resourceVersion := request.URL.Query().Get("resourceVersion")
	if resourceVersion == "" {
		resourceVersion = "0"
	}
	return resource.ApiParams{
		SkafosNamespace:   mux.Vars(request)["skafosNamespace"],
		SkafosName:        mux.Vars(request)["skafosName"],
		ResourceNamespace: mux.Vars(request)["resourceNamespace"],
		ResourceName:      mux.Vars(request)["resourceName"],
		Limit:             limit,
		Continue:          request.URL.Query().Get("continue"),
		ResourceVersion:   resourceVersion,
	}
}

func toGvrList(apiList []*metav1.APIResourceList) map[string][]map[string][]string {
	gvr := make(map[string][]map[string][]string)
	for _, api := range apiList {
		group, version := parseGroupVersion(api.GroupVersion)
		vr := map[string][]string{}
		for _, res := range api.APIResources {
			vr[version] = append(vr[version], res.Kind)
		}
		if _, ok := gvr[group]; !ok {
			gvr[group] = []map[string][]string{}
		}
		gvr[group] = append(gvr[group], vr)
	}
	return gvr
}

func parseGroupVersion(apiVersion string) (string, string) {
	split := strings.Split(apiVersion, "/")
	if len(split) == 1 {
		return "", split[0]
	}
	return split[0], split[1]
}
