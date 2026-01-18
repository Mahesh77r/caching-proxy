import type { HttpStatusCode } from "axios";

export interface CacheValue {
    status: HttpStatusCode;
    headers: any;
    data: any;
    createdAt?: Date;
    ttl?: number;
}