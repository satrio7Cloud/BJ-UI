/**
 * Preset konfigurasi daftar kode ekspedisi kurir logistik populer nasional di Indonesia.
 * Digunakan sebagai quick preset shortcut bagi admin untuk mengaktifkan
 * ekspedisi utama yang paling sering digunakan secara massal dari katalog Biteship.
 */
export const POPULAR_COURIER_CODES = [
    "jne",
    "sicepat",
    "jnt",
    "anteraja",
    "pos",
    "tiki",
] as const;

export type PopularCourierCode = (typeof POPULAR_COURIER_CODES)[number];

export const COURIER_PRESETS = {
    /**
     * Ekspedisi nasional utama dengan jangkauan terluas (JNE, SiCepat, J&T, Anteraja, Pos Indonesia, TIKI)
     */
    POPULAR: POPULAR_COURIER_CODES,
} as const;

