import crypto from 'crypto';

const CACHE_HEADERS_WHITELIST = [
    'authorization',
    'accept',
    'content-type',
];

export const buildCacheKey = (
    method: string,
    url: string,
    query: any,
    headers: any = {}
) => {
    const normalizedHeaders: Record<string, string> = {};

    for (const key of CACHE_HEADERS_WHITELIST) {
        if (headers[key]) {
            normalizedHeaders[key] = headers[key];
        }
    }

    const rawKey = JSON.stringify({
        method,
        url,
        query,
        headers: normalizedHeaders,
    });

    return crypto.createHash('sha256').update(rawKey).digest('hex');
};
