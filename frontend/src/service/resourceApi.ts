import {api, BASE_URL} from "./conf/axiosConf";

export const ResourceApi = {

    getNamespaces: async function getAllNamespaces(): Promise<any> {
        const response = await api.get("/namespaces");
        return response.data;
    },

    getDeployments: async function getAllDeployments(
        skafosNamespace: string,
        skafosName: string
    ): Promise<any> {
        const response = await api.get(
            `/namespaces/${skafosNamespace}/skafos/${skafosName}/deployments`
        );
        return response.data;
    },

    watchSkafosDeployments: function watchSkafosDeployments(
        skafosNamespace: string,
        skafosName: string,
        resVersion: string
    ): EventSource {
        return new EventSource(
            `${BASE_URL}/namespaces/${skafosNamespace}/skafos/${skafosName}/deployments/watch?resourceVersion=${resVersion}`
        );
    },

    getDeployment: async function getSkafosDeployment(
        skafosNamespace: string,
        skafosName: string,
        resourceNamespace: string,
        resourceName: string
    ): Promise<any> {
        const response = await api.get(
            `/namespaces/${skafosNamespace}/skafos/${skafosName}/namespaces/${resourceNamespace}/deployments/${resourceName}`
        );
        return response.data;
    },

    deleteDeployment: async function deleteDeployment(
        skafosNamespace: string,
        skafosName: string,
        resourceNamespace: string,
        resourceName: string
    ): Promise<any> {
        const response = await api.delete(
            `/namespaces/${skafosNamespace}/skafos/${skafosName}/namespaces/${resourceNamespace}/deployments/${resourceName}`
        );
        return response.data;
    },

    getPods: async function getAllPods(
        skafosNamespace: string,
        skafosName: string
    ): Promise<any> {
        const response = await api.get(
            `/namespaces/${skafosNamespace}/skafos/${skafosName}/pods`
        );
        return response.data;
    },

    watchSkafosPods: function watchSkafosPods(
        skafosNamespace: string,
        skafosName: string,
        resVersion: string
    ): EventSource {
        return new EventSource(
            `${BASE_URL}/namespaces/${skafosNamespace}/skafos/${skafosName}/pods/watch?resourceVersion=${resVersion}`
        );
    },

    getPod: async function getSkafosPod(
        skafosNamespace: string,
        skafosName: string,
        resourceNamespace: string,
        resourceName: string
    ): Promise<any> {
        const response = await api.get(
            `/namespaces/${skafosNamespace}/skafos/${skafosName}/namespaces/${resourceNamespace}/pods/${resourceName}`
        );
        return response.data;
    },

    deletePod: async function deletePod(
        skafosNamespace: string,
        skafosName: string,
        resourceNamespace: string,
        resourceName: string
    ): Promise<any> {
        const response = await api.delete(
            `/namespaces/${skafosNamespace}/skafos/${skafosName}/namespaces/${resourceNamespace}/pods/${resourceName}`
        );
        return response.data;
    },

    getResources: async function getResources(
        skafosNamespace: string,
        skafosName: string
    ): Promise<any> {
        const response = await api.get(
            `/namespaces/${skafosNamespace}/skafos/${skafosName}/resources`
        );
        return response.data;
    },

    watchResource: async function watchSkafosResource(
        skafosNamespace: string,
        skafosName: string,
        resVersion: string
    ): Promise<any> {
        return new EventSource(
            `${BASE_URL}/namespaces/${skafosNamespace}/skafos/${skafosName}/resources/watch?resourceVersion=${resVersion}`
        );
    },

    getResource: async function getResource(
        skafosNamespace: string,
        skafosName: string,
        resourceNamespace: string,
        resourceName: string
    ): Promise<any> {
        const response = await api.get(
            `/namespaces/${skafosNamespace}/skafos/${skafosName}/namespaces/${resourceNamespace}/resources/${resourceName}`
        );
        return response.data;
    },

    deleteResource: async function deleteResource(
        skafosNamespace: string,
        skafosName: string,
        resourceNamespace: string,
        resourceName: string
    ): Promise<any> {
        const response = await api.delete(
            `/namespaces/${skafosNamespace}/skafos/${skafosName}/namespaces/${resourceNamespace}/resources/${resourceName}`
        );
        return response.data;
    },

    getServices: async function getAllServices(
        skafosNamespace: string,
        skafosName: string
    ): Promise<any> {
        const response = await api.get(
            `/namespaces/${skafosNamespace}/skafos/${skafosName}/services`
        );
        return response.data;
    },

    getService: async function getSkafosService(
        skafosNamespace: string,
        skafosName: string,
        resourceNamespace: string,
        resourceName: string
    ): Promise<any> {
        const response = await api.get(
            `/namespaces/${skafosNamespace}/skafos/${skafosName}/namespaces/${resourceNamespace}/services/${resourceName}`
        );
        return response.data;
    },

    deleteService: async function deleteService(
        skafosNamespace: string,
        skafosName: string,
        resourceNamespace: string,
        resourceName: string
    ): Promise<any> {
        const response = await api.delete(
            `/namespaces/${skafosNamespace}/skafos/${skafosName}/namespaces/${resourceNamespace}/services/${resourceName}`
        );
        return response.data;
    },

    getIngresses: async function getAllIngresses(
        skafosNamespace: string,
        skafosName: string
    ): Promise<any> {
        const response = await api.get(
            `/namespaces/${skafosNamespace}/skafos/${skafosName}/ingresses`
        );
        return response.data;
    },

    getIngress: async function getSkafosIngress(
        skafosNamespace: string,
        skafosName: string,
        resourceNamespace: string,
        resourceName: string
    ): Promise<any> {
        const response = await api.get(
            `/namespaces/${skafosNamespace}/skafos/${skafosName}/namespaces/${resourceNamespace}/ingresses/${resourceName}`
        );
        return response.data;
    },

    deleteIngress: async function deleteIngress(
        skafosNamespace: string,
        skafosName: string,
        resourceNamespace: string,
        resourceName: string
    ): Promise<any> {
        const response = await api.delete(
            `/namespaces/${skafosNamespace}/skafos/${skafosName}/namespaces/${resourceNamespace}/ingresses/${resourceName}`
        );
        return response.data;
    },

    getNodes: async function getAllNodes(
        skafosNamespace: string,
        skafosName: string
    ): Promise<any> {
        const response = await api.get(
            `/namespaces/${skafosNamespace}/skafos/${skafosName}/nodes`
        );
        return response.data;
    },

    getNode: async function getSkafosNode(
        skafosNamespace: string,
        skafosName: string,
        resourceNamespace: string,
        resourceName: string
    ): Promise<any> {
        const response = await api.get(
            `/namespaces/${skafosNamespace}/skafos/${skafosName}/namespaces/${resourceNamespace}/nodes/${resourceName}`
        );
        return response.data;
    },

    getConfigMaps: async function getAllConfigMaps(
        skafosNamespace: string,
        skafosName: string
    ): Promise<any> {
        const response = await api.get(
            `/namespaces/${skafosNamespace}/skafos/${skafosName}/configMaps`
        );
        return response.data;
    },

    getConfigMap: async function getConfigMap(
        skafosNamespace: string,
        skafosName: string,
        resourceNamespace: string,
        resourceName: string
    ): Promise<any> {
        const response = await api.get(
            `/namespaces/${skafosNamespace}/skafos/${skafosName}/namespaces/${resourceNamespace}/configMaps/${resourceName}`
        );
        return response.data;
    },

    deleteConfigMap: async function deleteConfigMap(
        skafosNamespace: string,
        skafosName: string,
        resourceNamespace: string,
        resourceName: string
    ): Promise<any> {
        const response = await api.delete(
            `/namespaces/${skafosNamespace}/skafos/${skafosName}/namespaces/${resourceNamespace}/configMaps/${resourceName}`
        );
        return response.data;
    },

    getKubeConfig: async function getKubeConfig(
        namespace: string,
        name: string
    ): Promise<any> {
        const response = await api.get(
            `/namespaces/${namespace}/skafos/${name}/kubeconfig`
        );
        return response.data;
    },

    importConfig: async function importKubeConfig(
        data: JSON,
        provider: string,
        namespace: string,
        clusterName: string
    ): Promise<any> {
        const response = await api.post(`/skafos/namespaces/${namespace}/cluster/${clusterName}/import?provider=${provider}`, data)
        return response.data;
    },

    getPvcs: async function getPvcs(
        skafosNamespace: string,
        skafosName: string
    ): Promise<any> {
        const response = await api.get(
            `/namespaces/${skafosNamespace}/skafos/${skafosName}/persistentVolumeClaims`
        );
        return response.data;
    },

    deletePvc: async function deletePvc(
        skafosNamespace: string,
        skafosName: string,
        resourceNamespace: string,
        resourceName: string
    ): Promise<any> {
        const response = await api.delete(
            `/namespaces/${skafosNamespace}/skafos/${skafosName}/namespaces/${resourceNamespace}/persistentVolumeClaims/${resourceName}`
        );
        return response.data;
    },

    getPvs: async function getPvs(
        skafosNamespace: string,
        skafosName: string
    ): Promise<any> {
        const response = await api.get(
            `/namespaces/${skafosNamespace}/skafos/${skafosName}/persistentVolumes`
        );
        return response.data;
    },

    deletePv: async function deletePv(
        skafosNamespace: string,
        skafosName: string,
        resourceNamespace: string,
        resourceName: string
    ): Promise<any> {
        const response = await api.delete(
            `/namespaces/${skafosNamespace}/skafos/${skafosName}/namespaces/${resourceNamespace}/persistentVolumes/${resourceName}`
        );
        return response.data;
    },

    getReleases: async function getReleases(
        skafosNamespace: string,
        skafosName: string
    ): Promise<any> {
        const response = await api.get(
            `/namespaces/${skafosNamespace}/skafos/${skafosName}/releases`
        );
        return response.data;
    },

};
