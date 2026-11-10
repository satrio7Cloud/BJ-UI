export interface ShippingItem {
  name: string;
  value: number;
  weight: number;
  quantity: number;
}

export interface ShippingRateRequest {
  destination_postal_code: string;
  pickup_method: string;
}

export interface ShippingRateItem {
  courier_code: string;
  courier_name: string;
  courier_service_code: string;
  courier_service_name: string;
  duration_range?: string;
  duration_unit?: string;
  base_price?: number;
  final_price: number;
  // Property alias untuk kemudahan akses
  price?: number;
}

// Alias tipe agar kode yang mengimpor `ShippingRate` tetap kompatibel
export type ShippingRate = ShippingRateItem;

export interface ShippingRatesResponseData {
  pickup_method: string;
  multiplier: number;
  rates: ShippingRateItem[];
}

export interface ShippingRatesResponse {
  data: ShippingRatesResponseData;
  status: string;
  message?: string;
}

export interface ShippingCourier {
  available_for_cash_on_delivery: boolean;
  available_for_proof_of_delivery: boolean;
  available_for_instant_waybill_id: boolean;
  available_for_insurance: boolean;
  courier_company: string;
  courier_name: string;
  courier_service_code: string;
  courier_service_name: string;
  description: string;
}

export interface AdminCourierItem {
  id: string;
  courier_code: string;
  courier_name: string;
  courier_service_code: string;
  courier_service_name: string;
  tier?: string;
  service_type?: string;
  shipping_type?: string;
  duration_range?: string;
  duration_unit?: string;
  is_available: boolean;
}

export interface AdminCouriersResponse {
  data: AdminCourierItem[];
  status: string;
  message?: string;
}
