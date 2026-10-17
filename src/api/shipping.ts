import { API_BASE_URL, apiFetch, getAuthHeaders, sanitizeErrorMessage } from './config';

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

    const response = await apiFetch(`${API_BASE_URL}/shipping/rates`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
            destination_postal_code: destinationPostalCode,
            items: items || defaultItems,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(sanitizeErrorMessage(errorData.message || errorData.error || 'Gagal menghitung ongkos kirim'));
    }

    return response.json();
};

/**
 * Mendapatkan daftar kurir yang didukung
 */
export const getShippingCouriers = async (): Promise<{ code: number; data: ShippingCourier[]; message: string }> => {
    const response = await apiFetch(`${API_BASE_URL}/shipping/couriers`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(sanitizeErrorMessage(errorData.message || errorData.error || 'Gagal mengambil daftar kurir'));
    }

    return response.json();
};
