import { type ApiService } from "../../../api/services";

export interface CheckoutFormData {
  // Customer Data
  fullname: string;
  email: string;
  phone_number: string;
  address: string;
  postal_code: string;
  nik: string;
  // Vehicle Data
  model_id: string;
  plate_number: string;
  year: string;
  // Order Logistics Data
  pickup_method: string;
  pickup_courier: string;
  pickup_address: string;
  return_method: string;
  is_name_transfer_required: boolean;
  notes: string;
  samsat_origin: string;
  samsat_destination: string;
}

export interface CheckoutData {
  service: ApiService;
  pkg: "reguler" | "express";
  price: number;
}
