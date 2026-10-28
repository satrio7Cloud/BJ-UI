import { httpClient } from './httpClient';

export interface ApiService {
    id: string;
    service_name: string;
    category: string;
    service_fee: number;
    express_fee: number;
    admin_fee: number;
    swdkllj_fee: number;
    physical_check_fee: number;
    description: string;
    created_at: string;
}

export interface CreateServiceRequest {
    service_name: string;
    category: string;
    service_fee: number;
    express_fee: number;
    description: string;
}

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
