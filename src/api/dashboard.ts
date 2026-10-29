import { httpClient } from './httpClient';
import type {
    DashboardSummary,
    DashboardOrder,
    DashboardChartData,
    DashboardOrdersResponse,
} from '../types';

export type {
    DashboardSummary,
    DashboardOrder,
    DashboardChartData,
    DashboardOrdersResponse,
};

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
    const res = await httpClient.get<{ data: DashboardSummary }>('/dashboard/summary');
    return res.data;
};

export const getDashboardOrders = async (
    page = 1,
    limit = 20,
    status?: string
): Promise<DashboardOrdersResponse> => {
    return httpClient.get<DashboardOrdersResponse>('/dashboard/orders', {
        params: {
            page,
            limit,
            ...(status ? { status } : {}),
        },
    });
};

export const getDashboardChart = async (): Promise<DashboardChartData[]> => {
    const res = await httpClient.get<{ data: DashboardChartData[] }>('/dashboard/chart');
    return res.data || [];
};
