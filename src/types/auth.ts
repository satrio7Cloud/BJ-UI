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

