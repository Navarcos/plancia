import { api } from "./conf/axiosConf";
import { KindCreationRequest } from "../model/kind/kind";
import {SkafosGetResponse} from "../model/vsphere/vsphere/skafos";

export const DockerApi = {
  get: async function getDocker(namespace: string, name: string): Promise<SkafosGetResponse> {
    const response = await api.get(`/namespaces/${namespace}/dockerSkafos/${name}`);
    return response.data;
  },

  post: async function postDocker(request: KindCreationRequest): Promise<any> {
    const response = await api.post("/dockerSkafos", request);
    console.log("POST KIND", response);
    return response.data;
  },
};
