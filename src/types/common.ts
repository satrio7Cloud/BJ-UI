export interface PaginationMeta {
    page: number;
    limit: number;
    total?: number;
    total_records?: number;
}

export interface ApiResponse<T = any> {
    status: string;
    message?: string;
    data: T;
    meta?: PaginationMeta;
}

