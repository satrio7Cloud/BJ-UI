export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const apiFetch = async (url: string, options: RequestInit = {}, retries = 2): Promise<Response> => {
    for (let i = 0; i <= retries; i++) {
        try {
            const response = await fetch(url, options);
            if (response.status === 502 || response.status === 503 || response.status === 504) {
                if (i < retries) {
                    await new Promise((res) => setTimeout(res, 1000 * (i + 1)));
                    continue;
                }
            }
            return response;
        } catch (err: any) {
            if (i < retries) {
                await new Promise((res) => setTimeout(res, 1000 * (i + 1)));
                continue;
            }
            throw new Error('Terjadi kesalahan pada server.');
        }
    }
    throw new Error('Layanan backend sedang tidak dapat dijangkau. Silakan periksa koneksi atau coba beberapa saat lagi.');
};

export const sanitizeErrorMessage = (message: string): string => {
    if (!message) return 'Terjadi kesalahan pada server.';
    const msg = message.toLowerCase();
    if (
        msg.includes('tcp') ||
        msg.includes('dial') ||
        msg.includes('timeout') ||
        msg.includes('sqlserver') ||
        msg.includes('connection refused')
    ) {
        return 'Layanan database backend sedang tidak dapat dijangkau. Silakan periksa koneksi atau coba beberapa saat lagi.';
    }
    return message;
};

export const getAuthHeaders = (): HeadersInit => {
    const token = localStorage.getItem('adminToken');
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

