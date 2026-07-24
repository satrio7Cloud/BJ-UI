import { API_BASE_URL } from './config';

export interface CreateCustomerRequest {
  fullname: string;
  email: string;
  phone_number: string;
  address: string;
  nik: string;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const createCustomer = async (data: CreateCustomerRequest): Promise<{ message: string; status: string; data?: { id: string } }> => {
  const response = await fetch(`${API_BASE_URL}/customers`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Gagal menambahkan data pelanggan');
  }

  return response.json();
};
