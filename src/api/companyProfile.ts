import { API_BASE_URL, apiFetch, getAuthHeaders, sanitizeErrorMessage } from './config';

export interface CompanyProfile {
  id?: string;
  office_name: string;
  full_address: string;
  post_code?: string;
  postal_code?: string;
  phone_number: string;
  operational_hours: string;
  created_at?: string;
  updated_at?: string;
}

export const DEFAULT_OFFICE_PROFILE: CompanyProfile = {
  id: "48f7a65e-c273-4757-8880-8f5de48bc827",
  office_name: "Urus Berkas Kendaraan bersama",
  full_address: "Jl. Hasan Saban Kp.Pulo Kota Depok No. 04, Rt.03/09",
  post_code: "16435",
  phone_number: "085156419062",
  operational_hours: "Senin – Sabtu (08:00 – 17:00 WIB)",
};

/**
 * Mengambil informasi profil kantor / master office biro jasa
 */
export const getCompanyProfile = async (): Promise<{
  data: CompanyProfile;
  message: string;
  status: string;
}> => {
  const response = await apiFetch(`${API_BASE_URL}/company-profile`, {
    method: 'GET',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      sanitizeErrorMessage(errorData.message || 'Gagal mengambil data profil kantor')
    );
  }

  return response.json();
};

/**
 * Memperbarui profil kantor (Admin)
 */
export const updateCompanyProfile = async (
  data: Partial<CompanyProfile>
): Promise<{ data: CompanyProfile; message: string; status: string }> => {
  const response = await apiFetch(`${API_BASE_URL}/company-profile`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      sanitizeErrorMessage(errorData.message || 'Gagal memperbarui profil kantor')
    );
  }

  return response.json();
};
