import {api} from "./conf/axiosConf";
import {VSphereCreationRequest, SkafosGetResponse} from "../model/vsphere/vsphere/skafos";

export const VSphereApi = {
    get: async function getVSphere(namespace: string, name: string): Promise<SkafosGetResponse> {
        const response = await api.get(`/namespaces/${namespace}/vsphereSkafos/${name}`);
        return response.data;
    },

    post: async function postVSphere(request: VSphereCreationRequest): Promise<any> {
        const response = await api.post("/vsphereSkafos", request);
        console.log("POST VSPHERE", response);
        return response.data;
    }
}
