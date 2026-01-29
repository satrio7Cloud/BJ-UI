import { useState } from "react";
import { createWhatsappLink } from "../../utils/whatsaap";

export default function VehicleForm() {
  const [form, setForm] = useState({
    serviceType: "stnk",
    duration: "",
    ownerType: "",
    plateNumber: "",
    vehicleYear: "",
    samsatFrom: "",
    samsatTo: "",
    plateDigit: "",
    plateSuffix: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function getPlatePrice() {
    if (!form.plateDigit) return null;

    const priceMap: any = {
      "1_no": "Rp20.000.000",
      "1_yes": "Rp15.000.000",
      "2_no": "Rp15.000.000",
      "2_yes": "Rp10.000.000",
      "3_no": "Rp10.000.000",
      "3_yes": "Rp7.500.000",
      "4_no": "Rp7.500.000",
      "4_yes": "Rp5.000.000",
    };

    return priceMap[`${form.plateDigit}_${form.plateSuffix}`];
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    let message = `Halo, saya ingin mengurus kendaraan:\n`;
    message += `- Layanan: ${labelService(form.serviceType)}\n`;

    if (form.duration) {
      message += `- Masa STNK: ${form.duration} Tahun\n`;
    }

    if (form.ownerType) {
      message += `- Type Kendaraan: ${form.ownerType}\n`;
    }

    if (form.plateNumber) {
      message += `- Plat Kendaraan: ${form.plateNumber}\n`;
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
  }

  function labelService(value: string) {
    const map: Record<string, string> = {
      stnk: "Perpanjang STNK",
      balik_nama: "Balik Nama BPKB",
      mutasi: "Mutasi Kendaraan",
      blokir: "Blokir Kendaraan",
      request_plat: "Request Plat Nomor Cantik",
    };

    return map[value] || value;
  }

  const isSTNK = form.serviceType === "stnk";
  const isMutation =
    form.serviceType === "balik_nama" || form.serviceType === "mutasi";
  const isPlate = form.serviceType === "request_plat";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-gray-800">
      {/* JENIS LAYANAN */}
      <div>
        <label className="text-sm font-medium">Jenis Layanan</label>
        <select
          name="serviceType"
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        >
          <option value="stnk">Perpanjang STNK</option>
          <option value="balik_nama">Balik Nama BPKB</option>
          <option value="mutasi">Mutasi Kendaraan</option>
          <option value="blokir">Blokir Kendaraan</option>
          <option value="request_plat">Request Plat Nomor</option>
        </select>
      </div>

      {/* Type Kendaraan */}
      <div>
        <label className="text-sm font-medium">Type Kendaraan</label>
        <select
          name="vehicleType"
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        >
          <option value="mobil">Mobil</option>
          <option value="motor">Motor</option>
        </select>
      </div>

      {/* MASA STNK */}
      {isSTNK && (
        <div>
          <label className="text-sm font-medium">Masa STNK</label>
          <select
            name="duration"
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          >
            <option value="">Pilih</option>
            <option value="1">1 Tahun</option>
            <option value="5">5 Tahun</option>
          </select>

          {form.duration === "5" && (
            <p className="text-xs text-red-600 mt-1">
              * STNK 5 Tahun wajib ganti kaleng
            </p>
          )}
        </div>
      )}

      {/* SAMSAT */}
      {isMutation && (
        <>
          <div>
            <label className="text-sm font-medium">Samsat Asal</label>
            <input
              name="samsatFrom"
              placeholder="Contoh: Samsat Jakarta Selatan"
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Samsat Tujuan</label>
            <input
              name="samsatTo"
              placeholder="Contoh: Samsat Bandung"
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>
        </>
      )}

      {/* REQUEST PLAT */}
      {isPlate && (
        <>
          <div>
            <label className="text-sm font-medium">Jumlah Angka Plat</label>
            <select
              name="plateDigit"
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            >
              <option value="">Pilih</option>
              <option value="1">1 Angka</option>
              <option value="2">2 Angka</option>
              <option value="3">3 Angka</option>
              <option value="4">4 Angka</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Huruf Belakang</label>
            <select
              name="plateSuffix"
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            >
              <option value="">Pilih</option>
              <option value="no">Tanpa Huruf</option>
              <option value="yes">Dengan Huruf</option>
            </select>
          </div>

          {getPlatePrice() && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
              Estimasi Biaya:{" "}
              <strong className="text-blue-700">{getPlatePrice()}</strong>
            </div>
          )}
        </>
      )}

      {/* DATA KENDARAAN UMUM */}
      <div>
        <label className="text-sm font-medium">Nomor Plat Kendaraan</label>
        <input
          name="plateNumber"
          placeholder="Contoh: B 1234 XYZ"
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Tahun Kendaraan</label>
        <input
          name="vehicleYear"
          type="number"
          placeholder="Contoh: 2020"
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
      >
        Kirim Form
      </button>
    </form>
  );
}
