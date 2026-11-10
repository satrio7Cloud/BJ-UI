const rawApiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

/**
 * URL Base API dinamis:
 * Jika web diakses dari perangkat lain di jaringan lokal (misal HP via 192.168.x.x),
 * otomatis ubah target localhost menjadi IP host yang sama agar tidak connection refused di HP.
 */
export const API_BASE_URL = (() => {
    if (
        typeof window !== 'undefined' &&
        window.location.hostname &&
        window.location.hostname !== 'localhost' &&
        window.location.hostname !== '127.0.0.1'
    ) {
        try {
            const parsed = new URL(rawApiUrl);
            if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') {
                parsed.hostname = window.location.hostname;
                return parsed.toString().replace(/\/$/, '');
            }
        } catch {
            return rawApiUrl.replace(/localhost|127\.0\.0\.1/, window.location.hostname);
        }
    }
    return rawApiUrl;
})();

/**
 * Mengambil URL publik web aplikasi untuk pembuatan tautan (WhatsApp / Tautan Pembayaran):
 * Prioritas:
 * 1. VITE_PUBLIC_APP_URL dari .env (jika disetel, misal http://192.168.1.6:5173 atau domain publik)
 * 2. window.location.origin saat ini
 */
export const getPublicAppUrl = (): string => {
    const configured = import.meta.env.VITE_PUBLIC_APP_URL;
    if (configured && typeof configured === 'string') {
        return configured.replace(/\/$/, '');
    }
    if (typeof window !== 'undefined' && window.location.origin) {
        return window.location.origin;
    }
    return 'http://localhost:5173';
};

/**
 * Normalisasi pesan error teknis backend agar ramah pengguna
 */
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
