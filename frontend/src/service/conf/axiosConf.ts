import axios from "axios";
import keycloak from "../../auth/keycloak";
import {Config} from "../../config";


export const BASE_URL = Config.apiUrl;

export const api = axios.create({
    withCredentials: true,
    baseURL: BASE_URL,
});

const errorHandler = (error: any) => {
    const statusCode = error.response?.status;

    if (statusCode && statusCode !== 401) {
        console.error('Error: ', error);
    }

    return Promise.reject(error);
}

api.interceptors.request.use(
    config => {
        config.headers["Authorization"] = "Bearer " + keycloak.token;
        return config;
    },
    error => {
        Promise.reject(error).then();
    }
);

api.interceptors.response.use(
    undefined,
    (error) => errorHandler(error)
)




