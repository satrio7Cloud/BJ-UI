import { httpClient } from './httpClient';
import type { InvoiceAPIResponse, InvoiceData } from '../types';

export type { InvoiceAPIResponse, InvoiceData };

export const getInvoices = async (page: number = 1, limit: number = 10): Promise<InvoiceAPIResponse> => {
    return httpClient.get<InvoiceAPIResponse>('/invoices', {
        params: { page, limit },
    });
};

export const getInvoiceByOrderId = async (orderId: string): Promise<{ data: InvoiceData; status: string }> => {
    return httpClient.get<{ data: InvoiceData; status: string }>(`/invoices/order/${orderId}`, {
        skipAuth: true,
    });
};

export const generateInvoiceApi = async (orderId: string): Promise<{ data: InvoiceData; status: string }> => {
    try {
        return await httpClient.post<{ data: InvoiceData; status: string }>(
            '/invoices/customer',
            { order_id: orderId },
            { idempotencyKey: true, skipAuth: true }
        );
    } catch {
        return await httpClient.post<{ data: InvoiceData; status: string }>(
            '/invoices',
            { order_id: orderId },
            { idempotencyKey: true, skipAuth: true }
        );
    }
};

export const syncInvoiceStatusApi = async (id: string): Promise<{ data: InvoiceData; status: string }> => {
    return httpClient.post<{ data: InvoiceData; status: string }>(
        `/invoices/${id}/sync`,
        {},
        { skipAuth: true }
    );
};
