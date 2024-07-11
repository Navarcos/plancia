import {api} from "./conf/axiosConf";


export const ExtClusterApi = {
    getExternalClusters: async function getExternalClusters() {
        const response = await api.get(`/externalClusters`)
        return response.data;
    }
}
