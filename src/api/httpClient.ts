import { ApiError } from './apiError';
import { API_BASE_URL } from './config';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

export interface RequestOptions extends Omit<RequestInit, 'body' | 'method'> {
    body?: any;
    params?: Record<string, string | number | boolean | undefined | null>;
    /**
     * Jumlah percobaan ulang otomatis saat terjadi transient server error (502, 503, 504, network failure).
     * Secara default:
     * - 2 untuk method aman/idempotent (GET, HEAD, OPTIONS)
     * - 0 untuk method mutating (POST, PUT, PATCH, DELETE) guna mencegah duplikasi data transaksi/order/invoice.
     */
    retries?: number;
    /**
     * Waktu tunda dasar (ms) sebelum mencoba ulang. Menggunakan exponential backoff + jitter.
     * Default: 1000ms.
     */
    retryDelay?: number;
    /**
     * Lewati injeksi header Authorization Bearer token.
     */
    skipAuth?: boolean;
    /**
     * Batas waktu request dalam milidetik (ms) sebelum dibatalkan oleh AbortController.
     * Mencegah socket hang dan koneksi menggantung. Default: 15000ms (15 detik).
     */
    timeout?: number;
    /**
     * Idempotency Key untuk menjamin keamanan eksekusi pada operasi mutating (POST/PUT/PATCH/DELETE).
     * - Jika `true`: UUID v4 akan di-generate otomatis dan disertakan ke header `Idempotency-Key`.
     * - Jika `string`: nilai tersebut langsung digunakan sebagai header `Idempotency-Key`.
     */
    idempotencyKey?: string | boolean;
    /**
     * In-flight request deduplication (Promise Coalescing) untuk method GET.
     * Menggabungkan beberapa request identik yang dieksekusi secara bersamaan menjadi satu network call.
     * Default: true untuk method GET/HEAD.
     */
    deduplicate?: boolean;
}

/**
 * Generate UUID v4 standar untuk Idempotency-Key
 */
export function generateIdempotencyKey(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    // Fallback UUID v4 jika crypto.randomUUID tidak tersedia di runtime lawas
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

/**
 * Daftar HTTP method yang aman dan idempotent menurut spesifikasi RFC 7231
 */
const IDEMPOTENT_METHODS: ReadonlySet<HttpMethod> = new Set(['GET', 'HEAD', 'OPTIONS']);

export class HttpClient {
    private customBaseUrl?: string;
    /** Cache untuk in-flight request deduplication (Promise coalescing) */
    private inFlightRequests = new Map<string, Promise<any>>();

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
            const urlObj = new URL(
                fullUrl,
                this.getBaseUrl() || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost')
            );
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
     * Menyiapkan Headers default termasuk token autentikasi dan Idempotency-Key
     */
    private prepareHeaders(
        body: any,
        customHeaders?: HeadersInit,
        skipAuth = false,
        idempotencyKey?: string
    ): Headers {
        const headers = new Headers(customHeaders || {});

        // Inject Authorization token jika ada di localStorage
        if (!skipAuth && !headers.has('Authorization')) {
            if (typeof localStorage !== 'undefined') {
                const token = localStorage.getItem('adminToken');
                if (token) {
                    headers.set('Authorization', `Bearer ${token}`);
                }
            }
        }



        // Inject Idempotency-Key jika tersedia dan belum ada di header
        if (idempotencyKey && !headers.has('Idempotency-Key')) {
            headers.set('Idempotency-Key', idempotencyKey);
            // Injek juga X-Idempotency-Key untuk kompatibilitas gateway lama jika diperlukan
            if (!headers.has('X-Idempotency-Key')) {
                headers.set('X-Idempotency-Key', idempotencyKey);
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
     * Hitung waktu tunda retry dengan Exponential Backoff + Full Jitter
     */
    private calculateRetryDelay(attempt: number, baseDelay: number, retryAfterHeader?: string | null): number {
        // Jika server mengembalikan header Retry-After (dalam detik)
        if (retryAfterHeader) {
            const parsedSeconds = parseInt(retryAfterHeader, 10);
            if (!isNaN(parsedSeconds) && parsedSeconds > 0) {
                return parsedSeconds * 1000;
            }
        }

        const exponential = baseDelay * Math.pow(2, attempt);
        const maxDelay = 10000; // maksimal 10 detik
        // Full jitter: 50% - 100% dari exponential delay untuk menghindari thundering herd
        const jittered = exponential * (0.5 + Math.random() * 0.5);
        return Math.min(jittered, maxDelay);
    }

    /**
     * Eksekusi request internal dengan timeout dan AbortController terpadu
     */
    private async executeFetch(
        url: string,
        method: HttpMethod,
        headers: Headers,
        formattedBody: BodyInit | null | undefined,
        fetchOptions: Omit<RequestInit, 'body' | 'method' | 'headers'>,
        timeoutMs: number
    ): Promise<Response> {
        const controller = new AbortController();
        let isTimedOut = false;

        const timeoutId = setTimeout(() => {
            isTimedOut = true;
            controller.abort(new Error(`Request timeout setelah ${timeoutMs}ms`));
        }, timeoutMs);

        // Jika caller menyediakan AbortSignal sendiri, satukan dengan timeout controller
        let cleanupSignalListener: (() => void) | undefined;
        if (fetchOptions.signal) {
            const externalSignal = fetchOptions.signal;
            if (externalSignal.aborted) {
                clearTimeout(timeoutId);
                controller.abort(externalSignal.reason);
            } else {
                const onAbort = () => controller.abort(externalSignal.reason);
                externalSignal.addEventListener('abort', onAbort, { once: true });
                cleanupSignalListener = () => externalSignal.removeEventListener('abort', onAbort);
            }
        }

        try {
            const response = await fetch(url, {
                ...fetchOptions,
                method,
                headers,
                body: formattedBody,
                signal: controller.signal,
            });
            return response;
        } catch (error: any) {
            if (isTimedOut) {
                throw ApiError.networkError(new Error(`Request timeout (${timeoutMs}ms) ke ${url}`));
            }
            throw error;
        } finally {
            clearTimeout(timeoutId);
            if (cleanupSignalListener) {
                cleanupSignalListener();
            }
        }
    }

    /**
     * Memproses request HTTP dengan penanganan retry aman, idempotency key, timeout, dan in-flight deduplication
     */
    public async request<T = any>(
        endpoint: string,
        method: HttpMethod,
        options: RequestOptions = {}
    ): Promise<T> {
        const isSafe = IDEMPOTENT_METHODS.has(method);

        // Default retry: 2 untuk method aman (GET/HEAD/OPTIONS), 0 untuk mutating (POST/PUT/PATCH/DELETE)
        const defaultRetries = isSafe ? 2 : 0;
        const retries = options.retries !== undefined ? options.retries : defaultRetries;

        const {
            body,
            params,
            retryDelay = 1000,
            skipAuth = false,
            timeout = 15000,
            idempotencyKey: customIdempotencyKey,
            deduplicate = isSafe,
            headers: customHeaders,
            ...fetchOptions
        } = options;

        const url = this.buildUrl(endpoint, params);

        // Deduplikasi in-flight request untuk GET (Promise Coalescing)
        // Mencegah duplicate network call jika beberapa komponen memanggil GET yang sama secara bersamaan
        const dedupeKey = deduplicate && isSafe
            ? `${method}:${url}:${skipAuth ? 'noauth' : (typeof localStorage !== 'undefined' ? localStorage.getItem('adminToken') || '' : '')}`
            : null;

        if (dedupeKey && this.inFlightRequests.has(dedupeKey)) {
            return this.inFlightRequests.get(dedupeKey)! as Promise<T>;
        }

        // Tentukan Idempotency Key jika diminta atau jika request mutating secara eksplisit mengaktifkan retry
        let finalIdempotencyKey: string | undefined;
        if (typeof customIdempotencyKey === 'string' && customIdempotencyKey.trim()) {
            finalIdempotencyKey = customIdempotencyKey;
        } else if (customIdempotencyKey === true || (!isSafe && retries > 0)) {
            // Auto-generate UUID v4 agar seluruh percobaan retry memiliki key yang persis sama di backend
            finalIdempotencyKey = generateIdempotencyKey();
        }

        const headers = this.prepareHeaders(body, customHeaders, skipAuth, finalIdempotencyKey);

        // Siapkan body request
        let formattedBody: BodyInit | null | undefined = body;
        const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
        const isUrlSearchParams = typeof URLSearchParams !== 'undefined' && body instanceof URLSearchParams;

        if (body !== undefined && body !== null && !isFormData && !isUrlSearchParams && typeof body === 'object') {
            formattedBody = JSON.stringify(body);
        }

        const executionPromise = (async (): Promise<T> => {
            for (let attempt = 0; attempt <= retries; attempt++) {
                try {
                    const response = await this.executeFetch(
                        url,
                        method,
                        headers,
                        formattedBody,
                        fetchOptions,
                        timeout
                    );

                    // Retry hanya jika server error transient (502 Bad Gateway, 503 Service Unavailable, 504 Gateway Timeout)
                    if (response.status === 502 || response.status === 503 || response.status === 504) {
                        if (attempt < retries) {
                            const delay = this.calculateRetryDelay(
                                attempt,
                                retryDelay,
                                response.headers.get('Retry-After')
                            );
                            await new Promise((res) => setTimeout(res, delay));
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

                    // Jika respons gagal (!ok), tangani error & token expired
                    if (!response.ok) {
                        // Jika 401 Unauthorized (token habis/tidak valid), bersihkan session & arahkan ke login
                        if (response.status === 401 && !options.skipAuth) {
                            localStorage.removeItem("adminToken");

                            const adminPaths = ["/dashboard", "/invoice", "/vehicles", "/settings"];
                            const isOnAdminPage = adminPaths.some((path) =>
                                window.location.pathname.startsWith(path)
                            );

                            if (isOnAdminPage) {
                                window.location.href = "/admin";
                            }
                        }

                        throw ApiError.fromResponse(response, data);
                    }

                    return data as T;
                } catch (err: unknown) {
                    // Jika error adalah ApiError dari respons server (!ok), jangan retry (400, 401, 403, 404, 500)
                    if (err instanceof ApiError && !err.isNetworkError) {
                        throw err;
                    }

                    // Jika error jaringan / timeout dan masih ada kuota retry
                    if (attempt < retries) {
                        const delay = this.calculateRetryDelay(attempt, retryDelay);
                        await new Promise((res) => setTimeout(res, delay));
                        continue;
                    }

                    if (err instanceof ApiError) {
                        throw err;
                    }

                    // Habis percobaan retry, bungkus sebagai ApiError Network Error
                    throw ApiError.networkError(err);
                }
            }

            throw ApiError.networkError(new Error('Maksimum percobaan request terlampaui.'));
        })();

        // Daftarkan ke in-flight cache jika deduplikasi aktif
        if (dedupeKey) {
            this.inFlightRequests.set(dedupeKey, executionPromise);
            executionPromise.finally(() => {
                this.inFlightRequests.delete(dedupeKey);
            });
        }

        return executionPromise;
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
