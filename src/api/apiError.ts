import { sanitizeErrorMessage } from './config';

export interface ApiErrorPayload {
    status?: string | number;
    message?: string;
    error?: string;
    errors?: Record<string, string[]> | any;
    [key: string]: any;
}

export class ApiError extends Error {
    public readonly status: number;
    public readonly rawMessage: string;
    public readonly errors?: Record<string, string[]> | any;
    public readonly isNetworkError: boolean;
    public readonly data?: any;

    constructor(
        message: string,
        status: number = 500,
        options?: {
            rawMessage?: string;
            errors?: any;
            isNetworkError?: boolean;
            data?: any;
        }
    ) {
        super(sanitizeErrorMessage(message));
        this.name = 'ApiError';
        this.status = status;
        this.rawMessage = options?.rawMessage || message;
        this.errors = options?.errors;
        this.isNetworkError = options?.isNetworkError ?? false;
        this.data = options?.data;

        Object.setPrototypeOf(this, ApiError.prototype);
    }

    public static fromResponse(response: Response, data?: ApiErrorPayload | any): ApiError {
        const rawMessage =
            data?.message ||
            data?.error ||
            response.statusText ||
            `Request failed with status ${response.status}`;

        return new ApiError(rawMessage, response.status, {
            rawMessage,
            errors: data?.errors,
            data,
            isNetworkError: false,
        });
    }

    public static networkError(err?: Error | unknown): ApiError {
        const message = 'Layanan backend sedang tidak dapat dijangkau. Silakan periksa koneksi atau coba beberapa saat lagi.';
        return new ApiError(message, 0, {
            rawMessage: err instanceof Error ? err.message : String(err),
            isNetworkError: true,
        });
    }

    public isValidationError(): boolean {
        return this.status === 400 || this.status === 422;
    }

    public isUnauthorized(): boolean {
        return this.status === 401;
    }

    public isForbidden(): boolean {
        return this.status === 403;
    }

    public isNotFound(): boolean {
        return this.status === 404;
    }

    public isServerError(): boolean {
        return this.status >= 500;
    }
}
