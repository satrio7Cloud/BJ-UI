import { httpClient } from './httpClient';
import type {
    ShippingItem,
    ShippingRateRequest,
    ShippingRate,
    ShippingCourier,
} from '../types';

export type {
    ShippingItem,
    ShippingRateRequest,
    ShippingRate,
    ShippingCourier,
};

/**
 * Mendapatkan estimasi ongkos kirim berdasarkan kode pos tujuan
 */
export const getShippingRates = async (
    destinationPostalCode: string,
    items?: ShippingItem[]
): Promise<{ code: number; data: ShippingRate[]; message: string }> => {
    const defaultItems: ShippingItem[] = [
        {
            name: "Dokumen Layanan Biro Jasa",
            value: 100000,
            weight: 200,
            quantity: 1,
        },
    ];

    return httpClient.post<{ code: number; data: ShippingRate[]; message: string }>(
        '/shipping/rates',
        {
            destination_postal_code: destinationPostalCode,
            items: items || defaultItems,
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
