import { API_BASE_URL } from './config';

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
  const token = localStorage.getItem('adminToken');
  const response = await fetch(`${API_BASE_URL}/invoices?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.error || 'Failed to fetch invoices');
  }

  return response.json();
};

export const getInvoiceByOrderId = async (orderId: string): Promise<{ data: InvoiceData; status: string }> => {
  const response = await fetch(`${API_BASE_URL}/invoices/order/${orderId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.error || 'Failed to fetch invoice for this order');
  }

  return response.json();
};
