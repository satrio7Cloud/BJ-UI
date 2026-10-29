export interface Service {
  slug: string;
  name: string;
}

export interface ApiService {
  id: string;
  service_name: string;
  category: string;
  service_fee: number;
  express_fee: number;
  admin_fee: number;
  swdkllj_fee: number;
  physical_check_fee: number;
  description: string;
  created_at: string;
}

export interface CreateServiceRequest {
  service_name: string;
  category: string;
  service_fee: number;
  express_fee: number;
  description: string;
}
