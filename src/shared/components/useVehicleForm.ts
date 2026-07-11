import { useState } from "react";
import { createWhatsappLink } from "../utils/whatsapp";
import toast from "react-hot-toast";

export interface VehicleFormState {
  serviceType: string;
  duration: string;
  vehicleType: string;
  platCode: string;
  plateNumber: string;
  vehicleYear: string;
  samsatFrom: string;
  samsatTo: string;
  plateDigit: string;
  plateSuffix: string;
}

const CURRENT_YEAR = new Date().getFullYear();

export const vehicleYears = Array.from(
  { length: CURRENT_YEAR - 1999 + 1 },
  (_, i) => CURRENT_YEAR - i
);

export const priceMap: Record<string, string> = {
  "1_no": "Rp20.000.000",
  "1_yes": "Rp15.000.000",
  "2_no": "Rp15.000.000",
  "2_yes": "Rp10.000.000",
  "3_no": "Rp10.000.000",
  "3_yes": "Rp7.500.000",
  "4_no": "Rp7.500.000",
  "4_yes": "Rp5.000.000",
};

export function labelService(value: string): string {
  const map: Record<string, string> = {
    stnk: "Perpanjang STNK",
    balik_nama: "Balik Nama BPKB",
    mutasi: "Mutasi Kendaraan",
    blokir: "Blokir Kendaraan",
    request_plat: "Request Plat Nomor Cantik",
  };
  return map[value] || value;
}

export function isValidPlateBody(value: string): boolean {
  const regex = /^\d{1,4}\s[A-Z]{1,3}$/;
  return regex.test(value.trim().toUpperCase());
}

export function useVehicleForm() {
  const [form, setForm] = useState<VehicleFormState>({
    serviceType: "stnk",
    duration: "",
    vehicleType: "mobil",
    platCode: "B",
    plateNumber: "",
    vehicleYear: "",
    samsatFrom: "",
    samsatTo: "",
    plateDigit: "",
    plateSuffix: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const getPlatePrice = () => {
    if (!form.plateDigit || !form.plateSuffix) return null;
    return priceMap[`${form.plateDigit}_${form.plateSuffix}`] || null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidPlateBody(form.plateNumber)) {
      toast.error("Format plat tidak benar. Contoh yang benar: 1234 XYZ");
      return;
    }

    let message = `Halo, saya ingin mengurus kendaraan:\n`;
    message += `- Layanan: ${labelService(form.serviceType)}\n`;

    if (form.duration) {
      message += `- Masa STNK: ${form.duration} Tahun\n`;
    }

    if (form.vehicleType) {
      message += `- Type Kendaraan: ${form.vehicleType.charAt(0).toUpperCase() + form.vehicleType.slice(1)}\n`;
    }

    if (form.plateNumber) {
      const fullPlate = `${form.platCode} ${form.plateNumber.toUpperCase()}`;
      message += `- Plat Kendaraan: ${fullPlate}\n`;
    }

    if (form.vehicleYear) {
      message += `- Tahun Kendaraan: ${form.vehicleYear}\n`;
    }

    if (form.serviceType === "balik_nama" || form.serviceType === "mutasi") {
      message += `- Samsat Asal: ${form.samsatFrom}\n`;
      message += `- Samsat Tujuan: ${form.samsatTo}\n`;
    }

    if (form.serviceType === "request_plat") {
      message += `- Jumlah Angka Plat: ${form.plateDigit} Angka\n`;
      message += `- Huruf Belakang: ${
        form.plateSuffix === "yes" ? "Dengan Huruf" : "Tanpa Huruf"
      }\n`;

      const price = getPlatePrice();
      if (price) {
        message += `- Estimasi Biaya: ${price}\n`;
      }
    }

    window.open(createWhatsappLink(message), "_blank");
  };

  const isSTNK = form.serviceType === "stnk";
  const isMutation =
    form.serviceType === "balik_nama" || form.serviceType === "mutasi";
  const isPlate = form.serviceType === "request_plat";

  return {
    form,
    handleChange,
    handleSubmit,
    getPlatePrice,
    isSTNK,
    isMutation,
    isPlate,
  };
}
