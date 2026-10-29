import { httpClient } from './httpClient';
import type { CustomerVehicle, CreateCustomerVehicleRequest } from '../types';

export type { CustomerVehicle, CreateCustomerVehicleRequest };

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
