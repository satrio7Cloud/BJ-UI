import { API_BASE_URL, getAuthHeaders } from './config';

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


export const getDashboardSummary = async (): Promise<DashboardSummary> => {
    const res = await fetch(`${API_BASE_URL}/dashboard/summary`, {
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch dashboard summary');
    const json = await res.json();
    return json.data;
};

export interface DashboardOrdersResponse {
    data: DashboardOrder[];
    meta: {
        page: number;
        limit: number;
        total_records: number;
    };
}

export const getDashboardOrders = async (
    page = 1,
    limit = 20,
    status?: string
): Promise<DashboardOrdersResponse> => {
    let url = `${API_BASE_URL}/dashboard/orders?page=${page}&limit=${limit}`;
    if (status) {
        url += `&status=${encodeURIComponent(status)}`;
    }
    const res = await fetch(url, {
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch dashboard orders');
    const json = await res.json();
    return {
        data: json.data || [],
        meta: json.meta || { page: 1, limit: 20, total_records: 0 }
    };
};

export const getDashboardChart = async (): Promise<DashboardChartData[]> => {
    const res = await fetch(`${API_BASE_URL}/dashboard/chart`, {
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch dashboard chart');
    const json = await res.json();
    return json.data;
};
