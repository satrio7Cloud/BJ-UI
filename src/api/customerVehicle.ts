import { httpClient } from './httpClient';

export interface CustomerVehicle {
  id: string;
  customer_id: string;
  model_id: string;
  plate_number: string;
  year: number;
}

export interface CreateCustomerVehicleRequest {
  customer_id: string;
  model_id: string;
  plate_number: string;
  year: number;
}

export const getCustomerVehicles = async (
  customerId?: string
): Promise<{ data: CustomerVehicle[]; status: string }> => {
  return httpClient.get<{ data: CustomerVehicle[]; status: string }>('/vehicles', {
    params: customerId ? { customer_id: customerId } : undefined,
  });
};

export const createCustomerVehicle = async (
  data: CreateCustomerVehicleRequest
): Promise<{ message: string; status: string; data?: { id: string } }> => {
  return httpClient.post<{ message: string; status: string; data?: { id: string } }>(
    '/vehicles',
    data,
    { idempotencyKey: true }
  );
};
