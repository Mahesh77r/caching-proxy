import type { CacheValue } from "./interface/index.js";

const cache: Map<string, CacheValue> = new Map<string, CacheValue>();

export function get(key: string) {
    const value = cache.get(key);
    if (!value) return null;

    const elapsedTime = Date.now() - value.createdAt!.getTime();

    if (elapsedTime >= value.ttl!) {
        cache.delete(key);
        return null;
    }

    return value;
}


export function set(key: string, value: CacheValue) {
    cache.set(key, value);
}

export function clear() {
    cache.clear();
}

export function deleteKey(key: string) {
    cache.delete(key);
}

export function size() {
    return cache.size;
}

export function has(key: string) {
    return cache.has(key);
}

