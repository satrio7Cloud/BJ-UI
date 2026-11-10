import { httpClient } from './httpClient';
import type { Customer, CreateCustomerRequest } from '../types';

export type { Customer, CreateCustomerRequest };

export const getCustomers = async (): Promise<{ data: Customer[]; status: string }> => {
  return httpClient.get<{ data: Customer[]; status: string }>('/customers');
};

export const createCustomer = async (
  data: CreateCustomerRequest
): Promise<{ message: string; status: string; data?: { id: string } }> => {
  return httpClient.post<{ message: string; status: string; data?: { id: string } }>(
    '/customers',
    data,
    { idempotencyKey: true }
  );
};
