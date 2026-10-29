import { httpClient } from './httpClient';
import type {
    Brand,
    CreateBrandRequest,
    CreateModelRequest,
    VehicleModel,
} from '../types';

export type {
    Brand,
    CreateBrandRequest,
    CreateModelRequest,
    VehicleModel,
};

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
