import { httpClient } from './httpClient';
import type { ApiService, CreateServiceRequest } from '../types';

export type { ApiService, CreateServiceRequest };

export const getServices = async (): Promise<{ data: ApiService[]; status: string }> => {
    return httpClient.get<{ data: ApiService[]; status: string }>('/services');
};

export const createService = async (data: CreateServiceRequest): Promise<{ message: string; status: string }> => {
    return httpClient.post<{ message: string; status: string }>('/services', data, {
        idempotencyKey: true,
    });
};

export const updateService = async (id: string, data: CreateServiceRequest): Promise<{ message: string; status: string }> => {
    return httpClient.put<{ message: string; status: string }>(`/services/${id}`, data);
};

export const deleteService = async (id: string): Promise<{ message: string; status: string }> => {
    return httpClient.delete<{ message: string; status: string }>(`/services/${id}`);
};
