import axios, { type AxiosInstance } from "axios";
import https from "https";
import { Methods } from "../../enums/methods.enum.js";


const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
});

export const createAxiosInstance = (baseURL: string, headers: any): AxiosInstance => {
    delete headers.host;
    delete headers.connection;
    delete headers['content-length'];
    delete headers['accept-encoding'];
    return axios.create({
        httpsAgent,
        baseURL,
        headers,
    });
};

export const executeRequest = (
    axiosInstance: AxiosInstance,
    method: Methods,
    url: string,
    body?: any
) => {
    const requestMap = {
        [Methods.GET]: () => axiosInstance.get(url),
        [Methods.POST]: () => axiosInstance.post(url, body),
        [Methods.PUT]: () => axiosInstance.put(url, body),
        [Methods.DELETE]: () => axiosInstance.delete(url),
        [Methods.PATCH]: () => axiosInstance.patch(url, body),
        [Methods.HEAD]: () => axiosInstance.head(url),
        [Methods.OPTIONS]: () => axiosInstance.options(url),
        [Methods.TRACE]: () =>
            axiosInstance.request({ method: Methods.TRACE, url }),
        [Methods.CONNECT]: () =>
            axiosInstance.request({ method: Methods.CONNECT, url }),
    };

    return requestMap[method]?.();
};
