export interface Brand {
  id: string;
  brand_name: string;
}

export interface CreateBrandRequest {
  brand_name: string;
}

export interface CreateModelRequest {
  brand_id: string;
  model_name: string;
  brand_name: string;
  vehicle_type: "mobil" | "motor";
}

export interface VehicleModel {
  id: string;
  brand_id: string;
  brand_name?: string;
  model_name: string;
  vehicle_type: "mobil" | "motor";
}

export interface CustomerVehicle {
  id: string;
  customer_id: string;
  model_id: string;
  plate_number: string;
  year: number;
}

export interface CreateCustomerVehicleRequest {
  customer_id: string;
  model_id: string;
  plate_number: string;
  year: number;
}

