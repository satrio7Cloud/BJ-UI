import { httpClient } from './httpClient';

export interface ShippingItem {
    name: string;
    value: number;
    weight: number;
    quantity: number;
}

export interface ShippingRateRequest {
    destination_postal_code: string;
    items?: ShippingItem[];
}

export interface ShippingRate {
    courier_name: string;
    courier_service_name: string;
    price: number;
}

export interface ShippingCourier {
    available_for_cash_on_delivery: boolean;
    available_for_proof_of_delivery: boolean;
    available_for_instant_waybill_id: boolean;
    available_for_insurance: boolean;
    courier_company: string;
    courier_name: string;
    courier_service_code: string;
    courier_service_name: string;
    description: string;
}

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
        }
    );
};

/**
 * Mendapatkan daftar kurir yang didukung
 */
export const getShippingCouriers = async (): Promise<{ code: number; data: ShippingCourier[]; message: string }> => {
    return httpClient.get<{ code: number; data: ShippingCourier[]; message: string }>('/shipping/couriers');
};
