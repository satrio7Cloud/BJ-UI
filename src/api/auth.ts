import { httpClient } from './httpClient';

export interface AdminUser {
    id: string;
    email: string;
    role: string;
    [key: string]: any;
}

export interface LoginResponse {
    data?: {
        token: string;
        admin?: AdminUser;
    };
    token?: string;
    message?: string;
}

export interface AdminProfileResponse {
    data?: AdminUser;
    message?: string;
}

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
