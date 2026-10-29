export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
