export interface ShippingItem {
  name: string;
  value: number;
  weight: number;
  quantity: number;
}

export interface ShippingRateRequest {
  destination_postal_code: string;
  items?: ShippingItem[];
}

export interface ShippingRate {
  courier_name: string;
  courier_service_name: string;
  price: number;
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

