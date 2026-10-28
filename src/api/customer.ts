import { httpClient } from './httpClient';

export interface CreateCustomerRequest {
  fullname: string;
  email: string;
  phone_number: string;
  address: string;
  nik: string;
}

export const createCustomer = async (
  data: CreateCustomerRequest
): Promise<{ message: string; status: string; data?: { id: string } }> => {
  return httpClient.post<{ message: string; status: string; data?: { id: string } }>(
    '/customers',
    data,
    { idempotencyKey: true }
  );
};
