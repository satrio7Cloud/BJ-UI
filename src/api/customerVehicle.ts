import { API_BASE_URL, getAuthHeaders } from './config';

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


export const getCustomerVehicles = async (customerId?: string): Promise<{ data: CustomerVehicle[]; status: string }> => {
  const query = customerId ? `?customer_id=${encodeURIComponent(customerId)}` : '';
  const response = await fetch(`${API_BASE_URL}/vehicles${query}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Gagal mengambil data kendaraan customer');
  }

  return response.json();
};

export const createCustomerVehicle = async (data: CreateCustomerVehicleRequest): Promise<{ message: string; status: string; data?: { id: string } }> => {
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
