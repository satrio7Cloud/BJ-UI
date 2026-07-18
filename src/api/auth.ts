import { API_BASE_URL } from './config';

export const loginAdmin = async (email: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/admins/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    // Attempt to extract error message from response
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.error || 'Login failed');
  }

  return response.json();
};

export const logoutAdmin = async () => {
  const token = localStorage.getItem('adminToken');
  const response = await fetch(`${API_BASE_URL}/admins/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.error || 'Logout failed');
  }

  return response.json();
};

export const getAdminProfile = async () => {
  const token = localStorage.getItem('adminToken');
  const response = await fetch(`${API_BASE_URL}/admins/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.error || 'Failed to fetch profile');
  }

  return response.json();
};
