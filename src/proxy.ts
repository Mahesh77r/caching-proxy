import { HttpStatusCode } from "axios";
import { get, set } from "./cache.js";
import { Methods } from "./enums/methods.enum.js";
import { createAxiosInstance, executeRequest } from "./lib/http/httpClient.js";
import { buildCacheKey } from "./lib/cache/buildKey.js";
// Configuration object to avoid circular dependency
let proxyConfig: { origin: string; ttl: number } = {
    origin: '',
    ttl: 0
};

// Function to set configuration from outside
export const setProxyConfig = (config: { origin: string; ttl: number }) => {
    proxyConfig = config;
};


export const proxyHandler = async (req: any, res: any) => {
    try {
        const cacheKey = buildCacheKey(req.url, req.method as Methods, req.query, req.headers);
        console.log({ cacheKey });
        const cachedResponse = get(cacheKey);
        if (cachedResponse && allowedMethods.includes(req.method as Methods)) {
            res.setHeader('X-Cache', 'HIT');
            res.send(cachedResponse.data);
            return;
        }
        const response = await getResponse(req);
        set(cacheKey, {
            status: response?.status as HttpStatusCode,
            headers: response?.headers,
            data: response?.data,
            createdAt: new Date(),
            ttl: proxyConfig.ttl * 1000,
        });

        Object.entries(response.headers).forEach(([key, value]) => {
            if (key.toLowerCase() === 'transfer-encoding') return;
            res.setHeader(key, value as string);
        });

        res.setHeader('X-Cache', 'MISS');
        res.status(response?.status as HttpStatusCode).json(response?.data);

    } catch (error) {
        res.status(500).json({ error });
    }

}


const getResponse = async (req: Request) => {
    try {
        const axiosInstance = createAxiosInstance(proxyConfig.origin, req.headers);
        return executeRequest(
            axiosInstance,
            req.method as Methods,
            req.url,
            req.body
        );
    } catch (error) {
        throw error;
    }

}

const allowedMethods = [Methods.GET, Methods.HEAD, Methods.OPTIONS];