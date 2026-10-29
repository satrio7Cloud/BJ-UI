import { httpClient } from './httpClient';
import type {
    OrderStatusHistory,
    OrderActivity,
    OrderDocument,
    CreateOrderRequest,
    CreateOrderKTLRequest,
    OrderKTLResponse,
} from '../types';

export type {
    OrderStatusHistory,
    OrderActivity,
    OrderDocument,
    CreateOrderRequest,
    CreateOrderKTLRequest,
    OrderKTLResponse,
};

export const getOrderActivity = async (orderId: string): Promise<{ data: OrderActivity; status: string }> => {
    return httpClient.get<{ data: OrderActivity; status: string }>(`/orders/${orderId}`);
};

export const updateOrderStatus = async (
    orderId: string,
    payload: { status: string; notes?: string }
): Promise<{ data: any; status: string }> => {
    return httpClient.patch<{ data: any; status: string }>(`/orders/${orderId}/status`, payload);
};

export const getOrderDocuments = async (orderId: string): Promise<OrderDocument[]> => {
    try {
        const listData = await httpClient.get<{ data: OrderDocument[] }>(`/documents/order/${orderId}`);
        const docs: OrderDocument[] = listData.data || [];

        const docsWithUrls = await Promise.all(
            docs.map(async (doc) => {
                try {
                    const urlData = await httpClient.get<{ data: { url: string } }>(`/documents/${doc.id}/url`);
                    doc.url = urlData.data?.url;
                } catch (err) {
                    console.error("Failed to fetch url for document", doc.id, err);
                }
                return doc;
            })
        );

        return docsWithUrls;
    } catch {
        return [];
    }
};

export const createOrderApi = async (
    data: CreateOrderRequest
): Promise<{ data: { id: string }; message: string; status: string }> => {
    return httpClient.post<{ data: { id: string }; message: string; status: string }>(
        '/orders/customer',
        data,
        { idempotencyKey: true }
    );
};

export const uploadCustomerDocument = async (
    orderId: string,
    documentType: string,
    file: File
): Promise<any> => {
    const formData = new FormData();
    formData.append('order_id', orderId);
    formData.append('document_type', documentType);
    formData.append('document_file', file);

    return httpClient.post('/documents/customer', formData);
};

export const getKTLOrders = async (): Promise<OrderKTLResponse[]> => {
    try {
        const data = await httpClient.get<{ data: OrderKTLResponse[] }>('/orders/ktl');
        return data.data || [];
    } catch {
        return [];
    }
};

export const createOrderKTL = async (
    formData: FormData
): Promise<{ data: OrderKTLResponse; message: string; status: string }> => {
    return httpClient.post<{ data: OrderKTLResponse; message: string; status: string }>(
        '/orders/ktl',
        formData,
        { idempotencyKey: true }
    );
};

export const updateKtlStatus = async (
    orderId: string,
    payload: { status: string; notes?: string }
): Promise<{ data: any; status: string }> => {
    return httpClient.patch<{ data: any; status: string }>(`/orders/ktl/${orderId}/status`, payload);
};

export const verifyCustomerDocument = async (documentId: string, is_verified: boolean): Promise<any> => {
    return httpClient.patch<any>(`/documents/${documentId}/verify`, { is_verified });
};

export const getOrderKTLByID = async (id: string): Promise<{ data: OrderKTLResponse; status: string }> => {
    return httpClient.get<{ data: OrderKTLResponse; status: string }>(`/orders/ktl/${id}`);
};
