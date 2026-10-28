import { httpClient } from './httpClient';

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

export interface VehicleModel {
    id: string;
    brand_id: string;
    brand_name?: string;
    model_name: string;
    vehicle_type: "mobil" | "motor";
}

export const getBrands = async (): Promise<{ data: Brand[]; status: string }> => {
    return httpClient.get<{ data: Brand[]; status: string }>('/brands', {
        skipAuth: true,
    });
};

export const createBrand = async (data: CreateBrandRequest): Promise<{ message: string; status: string }> => {
    return httpClient.post<{ message: string; status: string }>('/brands', data, {
        idempotencyKey: true,
    });
};

export const createModel = async (data: CreateModelRequest): Promise<{ message: string; status: string }> => {
    return httpClient.post<{ message: string; status: string }>('/models', data, {
        idempotencyKey: true,
    });
};

export const getModels = async (): Promise<{ data: VehicleModel[]; status: string }> => {
    return httpClient.get<{ data: VehicleModel[]; status: string }>('/models', {
        skipAuth: true,
    });
};
