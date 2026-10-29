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

export interface OrderDocument {
  id: string;
  document_type: string;
  is_verified: boolean;
  url?: string;
}

export interface CreateOrderRequest {
  customer_id?: string;
  fullname?: string;
  phone_number?: string;
  nik?: string;
  email?: string;
  address?: string;

  vehicle_id?: string;
  plate_number?: string;
  model_id?: string;
  year?: number;

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
