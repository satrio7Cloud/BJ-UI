import { httpClient } from './httpClient';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  reference_id?: string;
  is_read: boolean;
  created_at: string;
}

export const getUnreadNotifications = async (): Promise<NotificationItem[]> => {
  const res = await httpClient.get<{ data: NotificationItem[] }>('/notifications/unread');
  return res.data || [];
};

export const markNotificationAsRead = async (id: string): Promise<void> => {
  await httpClient.patch<void>(`/notifications/${id}/read`);
};
