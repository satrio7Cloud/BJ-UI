import { httpClient } from './httpClient';
import type {
  DeliveryMethodPayload,
  DeliveryMethodsResponse,
  DeliveryMethodSingleResponse,
  ToggleDeliveryMethodResponse,
  UpdateDeliveryMethodPayload,
} from '../types/deliveryMethod';

/**
 * Mengambil daftar metode pengiriman publik untuk checkout
 * GET /api/v1/delivery-methods
 */
export const getDeliveryMethodsApi = async (): Promise<DeliveryMethodsResponse> => {
  return httpClient.get<DeliveryMethodsResponse>('/delivery-methods', {
    skipAuth: true,
  });
};

/**
 * Mengambil seluruh metode pengiriman untuk Admin (termasuk yang nonaktif)
 * GET /api/v1/admin/delivery-methods
 */
export const getAdminDeliveryMethodsApi = async (): Promise<DeliveryMethodsResponse> => {
  return httpClient.get<DeliveryMethodsResponse>('/admin/delivery-methods');
};

/**
 * Menambahkan metode pengiriman baru
 * POST /api/v1/admin/delivery-methods
 */
export const createDeliveryMethodApi = async (
  payload: DeliveryMethodPayload
): Promise<DeliveryMethodSingleResponse> => {
  return httpClient.post<DeliveryMethodSingleResponse>('/admin/delivery-methods', payload);
};

/**
 * Memperbarui data metode pengiriman
 * PUT /api/v1/admin/delivery-methods/:id
 */
export const updateDeliveryMethodApi = async (
  id: string,
  payload: UpdateDeliveryMethodPayload
): Promise<DeliveryMethodSingleResponse> => {
  return httpClient.put<DeliveryMethodSingleResponse>(`/admin/delivery-methods/${id}`, payload);
};

/**
 * Mengubah status aktif/nonaktif (Toggle) metode pengiriman
 * PATCH /api/v1/admin/delivery-methods/:id/toggle (No body)
 */
export const toggleDeliveryMethodApi = async (
  id: string
): Promise<ToggleDeliveryMethodResponse> => {
  return httpClient.patch<ToggleDeliveryMethodResponse>(
    `/admin/delivery-methods/${id}/toggle`,
    {}
  );
};

/**
 * Menghapus metode pengiriman
 * DELETE /api/v1/admin/delivery-methods/:id
 */
export const deleteDeliveryMethodApi = async (
  id: string
): Promise<{ status: string; message: string }> => {
  return httpClient.delete<{ status: string; message: string }>(`/admin/delivery-methods/${id}`);
};
