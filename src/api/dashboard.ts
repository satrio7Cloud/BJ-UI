import { API_BASE_URL } from './config';

export interface DashboardSummary {
  total_pending_orders: number;
  total_express_orders: number;
  total_completed_orders: number;
  total_revenue: number;
  pending_actions: {
    unverified_documents: number;
    stuck_orders: number;
  };
  top_services: {
    service_name: string;
    order_count: number;
  }[];
}

export interface DashboardOrder {
  order_id: string;
  order_date: string;
  status: string;
  service_level: string;
  total_cost: number;
  customer_name: string;
  phone_number: string;
  plate_number: string;
  service_name: string;
}

export interface DashboardChartData {
  date: string;
  order_count: number;
  revenue: number;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  const res = await fetch(`${API_BASE_URL}/dashboard/summary`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch dashboard summary');
  const json = await res.json();
  return json.data;
};

export const getDashboardOrders = async (): Promise<DashboardOrder[]> => {
  const res = await fetch(`${API_BASE_URL}/dashboard/orders`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch dashboard orders');
  const json = await res.json();
  return json.data;
};

export const getDashboardChart = async (): Promise<DashboardChartData[]> => {
  const res = await fetch(`${API_BASE_URL}/dashboard/chart`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch dashboard chart');
  const json = await res.json();
  return json.data;
};
