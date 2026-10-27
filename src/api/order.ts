import { API_BASE_URL, getAuthHeaders } from './config';

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
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || 'Failed to fetch order activity');
    }

    return response.json();
};

export const updateOrderStatus = async (
    orderId: string,
    payload: { status: string; notes?: string }
): Promise<{ data: any; status: string }> => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || 'Failed to update order status');
    }

    return response.json();
};

export interface OrderDocument {
    id: string;
    document_type: string;
    is_verified: boolean;
    url?: string;
}

export const getOrderDocuments = async (orderId: string): Promise<OrderDocument[]> => {
    // 1. Get document list for the order
    const listResponse = await fetch(`${API_BASE_URL}/documents/order/${orderId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });

    if (!listResponse.ok) {
        return [];
    }

    const listData = await listResponse.json();
    const docs: OrderDocument[] = listData.data || [];

    // 2. Fetch presigned URL for each document
    const docsWithUrls = await Promise.all(
        docs.map(async (doc) => {
            try {
                const urlRes = await fetch(`${API_BASE_URL}/documents/${doc.id}/url`, {
                    method: 'GET',
                    headers: getAuthHeaders(),
                });
                if (urlRes.ok) {
                    const urlData = await urlRes.json();
                    doc.url = urlData.data?.url;
                }
            } catch (err) {
                console.error("Failed to fetch url for document", doc.id, err);
            }
            return doc;
        })
    );

    return docsWithUrls;
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

export const createOrderApi = async (data: CreateOrderRequest): Promise<{ data: { id: string }; message: string; status: string }> => {
    const response = await fetch(`${API_BASE_URL}/orders/customer`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || 'Gagal membuat pesanan');
    }

    return response.json();
};

export const uploadCustomerDocument = async (orderId: string, documentType: string, file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('order_id', orderId);
    formData.append('document_type', documentType);
    formData.append('document_file', file);

    const token = localStorage.getItem('adminToken');
    const headers: HeadersInit = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    // DO NOT set 'Content-Type' when using FormData, the browser will set it automatically with the correct boundary.

    const response = await fetch(`${API_BASE_URL}/documents/customer`, {
        method: 'POST',
        headers: headers,
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Gagal mengunggah dokumen ${documentType}`);
    }

    return response.json();
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
    const response = await fetch(`${API_BASE_URL}/orders/ktl`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error('Gagal mengambil data pesanan KTL');
    }

    const data = await response.json();
    return data.data || [];
};

export const createOrderKTL = async (
    formData: FormData
): Promise<{ data: OrderKTLResponse; message: string; status: string }> => {
    const token = localStorage.getItem('adminToken');
    const headers: HeadersInit = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/orders/ktl`, {
        method: 'POST',
        headers,
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || 'Gagal membuat permintaan KTL');
    }

    return response.json();
};

export const updateKtlStatus = async (
    orderId: string,
    payload: { status: string; notes?: string }
): Promise<{ data: any; status: string }> => {
    const response = await fetch(`${API_BASE_URL}/orders/ktl/${orderId}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || 'Failed to update KTL status');
    }

    return response.json();
};

export const verifyCustomerDocument = async (documentId: string, is_verified: boolean): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/documents/${documentId}/verify`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ is_verified }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || 'Gagal memverifikasi dokumen');
    }

    return response.json();
};

export const getOrderKTLByID = async (id: string): Promise<{ data: OrderKTLResponse; status: string }> => {
    const response = await fetch(`${API_BASE_URL}/orders/ktl/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || 'Gagal mengambil detail KTL');
    }

    return response.json();
};

