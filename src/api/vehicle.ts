import { API_BASE_URL, getAuthHeaders } from './config';

export interface Brand {
    id: string;
    brand_name: string;
}

export interface CreateBrandRequest {
    brand_name: string;
}

export interface CreateModelRequest {
    brand_id: string;
    model_name: string;
    brand_name: string;
    vehicle_type: "mobil" | "motor";
}


export const getBrands = async (): Promise<{ data: Brand[]; status: string }> => {
    const response = await fetch(`${API_BASE_URL}/brands`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Gagal mengambil data merek');
    }

    return response.json();
};

export const createBrand = async (data: CreateBrandRequest): Promise<{ message: string; status: string }> => {
    const response = await fetch(`${API_BASE_URL}/brands`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Gagal menambahkan merek');
    }

    return response.json();
};

export const createModel = async (data: CreateModelRequest): Promise<{ message: string; status: string }> => {
    const response = await fetch(`${API_BASE_URL}/models`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Gagal menambahkan model');
    }

    return response.json();
};

export interface VehicleModel {
    id: string;
    brand_id: string;
    brand_name?: string;
    model_name: string;
    vehicle_type: "mobil" | "motor";
}

export const getModels = async (): Promise<{ data: VehicleModel[]; status: string }> => {
    const response = await fetch(`${API_BASE_URL}/models`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Gagal mengambil data model');
    }

    return response.json();
};
