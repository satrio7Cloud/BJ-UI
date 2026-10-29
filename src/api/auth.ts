import { httpClient } from './httpClient';
import type {
    AdminUser,
    LoginResponse,
    AdminProfileResponse,
} from '../types';

export type {
    AdminUser,
    LoginResponse,
    AdminProfileResponse,
};

/**
 * Melakukan proses login admin ke endpoint /admins/login
 */
export const loginAdmin = async (email: string, password: string): Promise<LoginResponse> => {
    return httpClient.post<LoginResponse>(
        '/admins/login',
        { email, password },
        { skipAuth: true }
    );
};

/**
 * Melakukan logout admin ke endpoint /admins/logout
 */
export const logoutAdmin = async (): Promise<{ message?: string }> => {
    return httpClient.post<{ message?: string }>('/admins/logout');
};

/**
 * Mengambil profil admin yang sedang aktif dari endpoint /admins/me
 */
export const getAdminProfile = async (): Promise<AdminProfileResponse> => {
    return httpClient.get<AdminProfileResponse>('/admins/me');
};
