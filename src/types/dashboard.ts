export interface DashboardSummary {
  total_pending_orders: number;
  total_express_orders: number;
  total_completed_orders: number;
  total_revenue: number;
  total_pending_ktls: number;
  total_completed_ktls: number;
  total_revenue_ktls: number;
  pending_actions: {
    unverified_documents: number;
    stuck_orders: number;
    stuck_ktls: number;
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
  unverified_docs?: number;
}

export interface DashboardChartData {
  date: string;
  order_count: number;
  revenue: number;
}

export interface DashboardOrdersResponse {
  data: DashboardOrder[];
  meta: {
    page: number;
    limit: number;
    total_records: number;
  };
}

