import { httpClient } from './httpClient';
import type { CreateCustomerRequest } from '../types';

export type { CreateCustomerRequest };

export const createCustomer = async (
  data: CreateCustomerRequest
): Promise<{ message: string; status: string; data?: { id: string } }> => {
  return httpClient.post<{ message: string; status: string; data?: { id: string } }>(
    '/customers',
    data,
    { idempotencyKey: true }
  );
};
