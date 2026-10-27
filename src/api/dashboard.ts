import { httpClient } from './httpClient';

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

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
    const res = await httpClient.get<{ data: DashboardSummary }>('/dashboard/summary');
    return res.data;
};

export const getDashboardOrders = async (
    page = 1,
    limit = 20,
    status?: string
): Promise<DashboardOrdersResponse> => {
    const res = await httpClient.get<DashboardOrdersResponse>('/dashboard/orders', {
        params: {
            page,
            limit,
            status: status || undefined,
        },
    });
    return {
        data: res.data || [],
        meta: res.meta || { page: 1, limit, total_records: 0 },
    };
};

export const getDashboardChart = async (): Promise<DashboardChartData[]> => {
    const res = await httpClient.get<{ data: DashboardChartData[] }>('/dashboard/chart');
    return res.data;
};
