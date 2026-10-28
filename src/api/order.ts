import { httpClient } from './httpClient';

export interface OrderStatusHistory {
    id?: string;
    status: string;
    notes: string;
    courier_name?: string;
    courier_service?: string;
    created_at: string;
}

export interface OrderActivity {
    order_id: string;
    status: string;
    history: OrderStatusHistory[];
}

export const getOrderActivity = async (orderId: string): Promise<{ data: OrderActivity; status: string }> => {
    return httpClient.get<{ data: OrderActivity; status: string }>(`/orders/${orderId}`);
};

export const updateOrderStatus = async (
    orderId: string,
    payload: { status: string; notes?: string }
): Promise<{ data: any; status: string }> => {
    return httpClient.patch<{ data: any; status: string }>(`/orders/${orderId}/status`, payload);
};

export interface OrderDocument {
    id: string;
    document_type: string;
    is_verified: boolean;
    url?: string;
}

export const getOrderDocuments = async (orderId: string): Promise<OrderDocument[]> => {
    try {
        // 1. Ambil daftar dokumen untuk order
        const listData = await httpClient.get<{ data: OrderDocument[] }>(`/documents/order/${orderId}`);
        const docs: OrderDocument[] = listData.data || [];

        // 2. Ambil presigned URL untuk setiap dokumen secara paralel
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

export interface CreateOrderRequest {
    // Customer Details (Bisa kirim ID atau data langsung)
    customer_id?: string;
    fullname?: string;
    phone_number?: string;
    nik?: string;
    email?: string;
    address?: string;

    // Vehicle Details (Bisa kirim ID atau data langsung)
    vehicle_id?: string;
    plate_number?: string;
    model_id?: string;
    year?: number;

    // Service & Logistics
    service_id: string;
    pickup_method?: string;
    pickup_address?: string;
    return_address?: string;
    customer_tracking_number?: string;
    return_method?: string;
    tax_amount?: number;
    service_fee?: number;
    admin_fee?: number;
    physical_check_fee?: number;
    delivery_fee?: number;
    express_fee?: number;
    courier_name?: string;
    courier_service?: string;
    service_level?: string;
    is_name_transfer_required?: boolean;
    notes?: string;
    samsat_origin?: string;
    samsat_destination?: string;
}

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

export interface CreateOrderKTLRequest {
    customer_name: string;
    phone_number: string;
    vehicle_type: string;
    region: string;
    fee: number;
    bukti_ktl: File;
}

export interface OrderKTLResponse {
    id: string;
    customer_name: string;
    phone_number?: string;
    vehicle_type: string;
    region: string;
    fee: number;
    merchant_ref?: string;
    status: string;
    order_date: string;
    bukti_ktl_path?: string;
    bukti_pembayaran_path?: string;
    snap_token?: string;
}

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
