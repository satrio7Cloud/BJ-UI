import { ApiError } from './apiError';
import { API_BASE_URL } from './config';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestOptions extends Omit<RequestInit, 'body' | 'method'> {
    body?: any;
    params?: Record<string, string | number | boolean | undefined | null>;
    retries?: number;
    retryDelay?: number;
    skipAuth?: boolean;
}

export class HttpClient {
    private customBaseUrl?: string;

    constructor(baseUrl?: string) {
        if (baseUrl) {
            this.customBaseUrl = baseUrl.replace(/\/+$/, '');
        }
    }

    /**
     * Mendapatkan base URL API secara aman (menghindari TDZ / circular dependency saat startup)
     */
    public getBaseUrl(): string {
        if (this.customBaseUrl) {
            return this.customBaseUrl;
        }

        try {
            if (typeof API_BASE_URL !== 'undefined' && API_BASE_URL) {
                return API_BASE_URL.replace(/\/+$/, '');
            }
        } catch {
            // Abaikan jika API_BASE_URL sedang dalam status TDZ
        }

        const envUrl = import.meta.env.VITE_API_BASE_URL || '';
        return envUrl ? envUrl.replace(/\/+$/, '') : '';
    }

    /**
     * Membentuk URL lengkap berdasarkan baseUrl dan query parameters opsional
     */
    private buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined | null>): string {
        let fullUrl: string;

        if (/^https?:\/\//i.test(endpoint)) {
            fullUrl = endpoint;
        } else {
            const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
            fullUrl = `${this.getBaseUrl()}${cleanEndpoint}`;
        }

        if (params && Object.keys(params).length > 0) {
            const urlObj = new URL(fullUrl);
            Object.entries(params).forEach(([key, val]) => {
                if (val !== undefined && val !== null) {
                    urlObj.searchParams.set(key, String(val));
                }
            });
            fullUrl = urlObj.toString();
        }

        return fullUrl;
    }

    /**
     * Menyiapkan Headers default termasuk token autentikasi (jika tersedia)
     */
    private prepareHeaders(body: any, customHeaders?: HeadersInit, skipAuth = false): Headers {
        const headers = new Headers(customHeaders || {});

        // Inject Authorization token jika ada di localStorage
        if (!skipAuth && !headers.has('Authorization')) {
            const token = localStorage.getItem('adminToken');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
        }

        // Jika bukan FormData dan bukan URLSearchParams, set default Content-Type: application/json
        const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
        const isUrlSearchParams = typeof URLSearchParams !== 'undefined' && body instanceof URLSearchParams;

        if (!isFormData && !isUrlSearchParams && !headers.has('Content-Type')) {
            headers.set('Content-Type', 'application/json');
        }

        return headers;
    }

    /**
     * Memproses request HTTP dengan penanganan retry otomatis untuk transient server error
     */
    public async request<T = any>(
        endpoint: string,
        method: HttpMethod,
        options: RequestOptions = {}
    ): Promise<T> {
        const {
            body,
            params,
            retries = 2,
            retryDelay = 1000,
            skipAuth = false,
            headers: customHeaders,
            ...fetchOptions
        } = options;

        const url = this.buildUrl(endpoint, params);
        const headers = this.prepareHeaders(body, customHeaders, skipAuth);

        // Siapkan body request
        let formattedBody: BodyInit | null | undefined = body;
        const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
        const isUrlSearchParams = typeof URLSearchParams !== 'undefined' && body instanceof URLSearchParams;

        if (body !== undefined && body !== null && !isFormData && !isUrlSearchParams && typeof body === 'object') {
            formattedBody = JSON.stringify(body);
        }

        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                const response = await fetch(url, {
                    ...fetchOptions,
                    method,
                    headers,
                    body: formattedBody,
                });

                // Jika respons 502/503/504 (Server Overload / Gateway Error), retry jika masih ada kuota
                if (response.status === 502 || response.status === 503 || response.status === 504) {
                    if (attempt < retries) {
                        await new Promise((res) => setTimeout(res, retryDelay * (attempt + 1)));
                        continue;
                    }
                }

                // Parse respons body
                let data: any = null;
                const contentType = response.headers.get('content-type') || '';
                const isJson = contentType.includes('application/json');

                if (response.status !== 204) {
                    if (isJson) {
                        data = await response.json().catch(() => null);
                    } else {
                        data = await response.text().catch(() => null);
                    }
                }

                // Jika respons gagal (!ok), lempar ApiError
                if (!response.ok) {
                    throw ApiError.fromResponse(response, data);
                }

                return data as T;
            } catch (err: unknown) {
                // Jika error adalah ApiError yang dilempar di atas, teruskan langsung
                if (err instanceof ApiError) {
                    throw err;
                }

                // Jika TypeError (jaringan terputus / backend mati) dan masih ada percobaan retry
                if (attempt < retries) {
                    await new Promise((res) => setTimeout(res, retryDelay * (attempt + 1)));
                    continue;
                }

                // Habis percobaan retry, bungkus sebagai ApiError Network Error
                throw ApiError.networkError(err);
            }
        }

        throw ApiError.networkError(new Error('Maksimum percobaan request terlampaui.'));
    }

    /** HTTP GET */
    public get<T = any>(endpoint: string, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, 'GET', options);
    }

    /** HTTP POST */
    public post<T = any>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, 'POST', { ...options, body });
    }

    /** HTTP PUT */
    public put<T = any>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, 'PUT', { ...options, body });
    }

    /** HTTP PATCH */
    public patch<T = any>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, 'PATCH', { ...options, body });
    }

    /** HTTP DELETE */
    public delete<T = any>(endpoint: string, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, 'DELETE', options);
    }
}

/**
 * Singleton instance dari HttpClient yang siap digunakan langsung di seluruh aplikasi
 */
export const httpClient = new HttpClient();
