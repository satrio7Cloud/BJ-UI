import { API_BASE_URL } from './config';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  reference_id?: string;
  is_read: boolean;
  created_at: string;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const getUnreadNotifications = async (): Promise<NotificationItem[]> => {
  const res = await fetch(`${API_BASE_URL}/notifications/unread`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch unread notifications');
  const json = await res.json();
  return json.data || [];
};

export const markNotificationAsRead = async (id: string): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to mark notification as read');
};
