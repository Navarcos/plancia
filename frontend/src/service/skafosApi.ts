import {api, BASE_URL} from "./conf/axiosConf";
import {SkafosListItemResponse, SkafosStats} from "../model/vsphere/skafos";
import {Events} from "../model/vsphere/subelements/event";
import {VSphereApi} from "./vsphereApi";
import {SkafosGetResponse} from "../model/vsphere/vsphere/skafos";
import {DockerApi} from "./dockerApi";


export const SkafosApi = {
    getAllSkafos: async function getAllSkafos(): Promise<SkafosListItemResponse[]> {
        const response = await api.get("/skafos");
        return response.data;
    },

    getSkafosStats: async function getSkafosStats(namespace: string, name: string): Promise<SkafosStats> {
        const response = await api.get(`/namespaces/${namespace}/skafos/${name}/stats`);
        return response.data;
    },

    getSkafosEvents: async function getSkafosEvents(namespace: string, name: string): Promise<Events> {
        const response = await api.get(`/namespaces/${namespace}/skafos/${name}/events`);
        return response.data;
    },

    getSkafos: async function getSkafos(namespace: string, name: string, provider: string): Promise<SkafosGetResponse> {
        switch (provider) {
            case "vsphere" :
                return VSphereApi.get(namespace, name)
            default:
                return DockerApi.get(namespace, name);
        }
    },

    watchSkafosEvents: function watchSkafosEvents(namespace: string, name: string, resVersion: string): EventSource {
        return new EventSource(`${BASE_URL}/namespaces/${namespace}/skafos/${name}/events/watch?resourceVersion=${resVersion}`);
    },

    getSkafosKubeconfig: async function getSkafosKubeconfig(namespace: string, name: string): Promise<any> {
        const response = await api.get(`/namespaces/${namespace}/skafos/${name}/kubeconfig`);
        console.log("KUBECONFIG", response);
        return response.data;
    },

    patchKubeadm: async function patchKubeadm(namespace: string, name: string, nodes: number): Promise<any> {
        const response = await api.patch(`/namespaces/${namespace}/kubeadmControlplane/${name}?nodes=${nodes}`);
        return response.data;
    },

    patchMachine: async function patchMachine(namespace: string, name: string, nodes: number): Promise<any> {
        const response = await api.patch(`/namespaces/${namespace}/machineDeployment/${name}?nodes=${nodes}`);
        return response.data;
    },

    deleteSkafos: async function deleteSkafos(namespace: string, name: string): Promise<any> {
        const response = await api.delete(`/namespaces/${namespace}/skafos/${name}`);
        console.log("DELETE SKAFOS", response);
        return response.data;
    },

    getMetrics: async function getSkafosMetrics(namespace: string, name: string): Promise<any> {
        const response = await api.get(`/namespaces/${namespace}/skafos/${name}/metrics`);
        return response.data;
    }
}

