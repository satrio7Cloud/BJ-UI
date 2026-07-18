import { API_BASE_URL } from './config';

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

const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const getCustomerVehicles = async (): Promise<{ data: CustomerVehicle[]; status: string }> => {
  const response = await fetch(`${API_BASE_URL}/vehicles`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Gagal mengambil data kendaraan customer');
  }

  return response.json();
};

export const createCustomerVehicle = async (data: CreateCustomerVehicleRequest): Promise<{ message: string; status: string }> => {
  const response = await fetch(`${API_BASE_URL}/vehicles`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Gagal menambahkan kendaraan customer');
  }

  return response.json();
};
