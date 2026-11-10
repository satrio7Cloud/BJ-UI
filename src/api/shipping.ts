import { httpClient } from './httpClient';
import type {
    ShippingItem,
    ShippingRateRequest,
    ShippingRate,
    ShippingRatesResponse,
    ShippingRatesResponseData,
    ShippingCourier,
    AdminCourierItem,
    AdminCouriersResponse,
} from '../types';
import type {
    BackendShippingSettings,
    BackendShippingSettingsResponse,
    BackendShippingSettingsUpdateResponse,
} from '../types/shippingSettings';

export type {
    ShippingItem,
    ShippingRateRequest,
    ShippingRate,
    ShippingRatesResponse,
    ShippingRatesResponseData,
    ShippingCourier,
    AdminCourierItem,
    AdminCouriersResponse,
};

/**
 * Mengambil pengaturan pengiriman dari backend
 * GET /api/v1/settings/shipping
 */
export const getBackendShippingSettingsApi = async (): Promise<BackendShippingSettingsResponse> => {
    return httpClient.get<BackendShippingSettingsResponse>('/settings/shipping', {
        skipAuth: true,
    });
};

/**
 * Menyimpan pengaturan pengiriman admin ke backend
 * PUT /api/v1/admin/settings/shipping
 */
export const updateBackendShippingSettingsApi = async (
    payload: BackendShippingSettings
): Promise<BackendShippingSettingsUpdateResponse> => {
    return httpClient.put<BackendShippingSettingsUpdateResponse>('/admin/settings/shipping', {
        enabled_couriers: payload.enabled_couriers,
        default_item_weight: payload.default_item_weight,
        default_item_value: payload.default_item_value,
    });
};

/**
 * Mendapatkan estimasi ongkos kirim berdasarkan kode pos tujuan dan metode penyerahan
 * POST /api/v1/shipping/rates
 * Payload: { destination_postal_code, pickup_method }
 */
export const getShippingRates = async (
    destinationPostalCode: string,
    pickupMethod: string = "DOOR_TO_DOOR"
): Promise<ShippingRatesResponse> => {
    return httpClient.post<ShippingRatesResponse>(
        '/shipping/rates',
        {
            destination_postal_code: destinationPostalCode,
            pickup_method: pickupMethod,
        },
        { skipAuth: true }
    );
};

/**
 * Mendapatkan daftar kurir yang tersedia
 */
export const getCouriers = async (): Promise<{ code: number; data: ShippingCourier[]; message: string }> => {
    return httpClient.get<{ code: number; data: ShippingCourier[]; message: string }>('/shipping/couriers', {
        skipAuth: true,
    });
};

/**
 * Mengambil katalog lengkap kurir & layanan dari database admin
 * GET /api/v1/admin/couriers
 */
export const getAdminCouriersApi = async (): Promise<AdminCouriersResponse> => {
    return httpClient.get<AdminCouriersResponse>('/admin/couriers');
};
