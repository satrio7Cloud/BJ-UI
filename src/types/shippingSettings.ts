export interface CourierServiceItem {
  courier_code: string;
  courier_service_code: string;
}

export interface BackendShippingSettings {
  id?: string;
  enabled_couriers: CourierServiceItem[];
  default_item_weight: number;
  default_item_value: number;
}

export interface BackendShippingSettingsResponse {
  data: BackendShippingSettings;
  status: string;
}

export interface BackendShippingSettingsUpdateResponse {
  message: string;
  status: string;
}

export interface ShippingSettings {
  // 1. Ekspedisi & Layanan yang aktif di backend
  enabled_couriers: CourierServiceItem[];

  // Convenience helper nama kurir aktif (misal: ["jne", "sicepat", "jnt"])
  enabledCouriers: string[];

  // 2. Pengaturan Default Paket Berkas (Dokumen)
  defaultItemWeight: number; // default: 200 gram
  defaultItemValue: number;  // default: 100000 (Rp - Nilai pertanggungan/asuransi)

  // 3. Multiplier Ongkos Kirim Door-to-Door (PP)
  doorToDoorMultiplier: number; // default: 2
}
