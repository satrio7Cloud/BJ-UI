import { API_BASE_URL, apiFetch, sanitizeErrorMessage } from './config';

export interface ApiService {
  id: string;
  service_name: string;
  category: string;
  service_fee: number;
  express_fee: number;
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

const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const getServices = async (): Promise<{ data: ApiService[]; status: string }> => {
  const response = await apiFetch(`${API_BASE_URL}/services`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(sanitizeErrorMessage(errorData.message || 'Gagal mengambil data layanan'));
  }

  return response.json();
};

export const createService = async (data: CreateServiceRequest): Promise<{ message: string; status: string }> => {
  const response = await apiFetch(`${API_BASE_URL}/services`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(sanitizeErrorMessage(errorData.message || 'Gagal menambahkan layanan baru'));
  }

  return response.json();
};
