import { httpClient } from './httpClient';
import type { NotificationItem } from '../types';

export type { NotificationItem };

export const getUnreadNotifications = async (): Promise<NotificationItem[]> => {
  const res = await httpClient.get<{ data: NotificationItem[] }>('/notifications/unread');
  return res.data || [];
};

export const markNotificationAsRead = async (id: string): Promise<void> => {
  await httpClient.patch<void>(`/notifications/${id}/read`);
};
