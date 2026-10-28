import { httpClient } from './httpClient';

export interface InvoiceAPIResponse {
    data: InvoiceData[];
    meta: {
        limit: number;
        page: number;
        total: number;
    };
    status: string;
}

export interface InvoiceData {
    invoice_id: string;
    order_id: string;
    invoice_number: string;
    issue_date: string;
    due_date: string;
    payment_status: string;
    payment_token: string | null;
    payment_url: string | null;
    qris_payload: string | null;
    qris_amount: number | null;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    vehicle_plate: string;
    service_name: string;
    tax_amount: number;
    service_fee: number;
    admin_fee: number;
    physical_check_fee: number;
    delivery_fee: number;
    express_fee: number;
    total_cost: number;
}

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
    return httpClient.post<{ data: InvoiceData; status: string }>(
        '/invoices',
        { order_id: orderId },
        { idempotencyKey: true }
    );
};
