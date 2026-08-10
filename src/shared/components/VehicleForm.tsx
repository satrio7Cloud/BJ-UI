import { useVehicleForm, vehicleYears } from "./useVehicleForm";
import { Input } from "./Input";
import { Select } from "./Select";
import Button from "./Button";

export default function VehicleForm() {
  const {
    form,
    handleChange,
    handleSubmit,
    getPlatePrice,
    isSTNK,
    isMutation,
    isPlate,
  } = useVehicleForm();

  return (
    <form
      onSubmit={handleSubmit}
      onClick={(e) => e.stopPropagation()}
      className="relative space-y-5 text-gray-800 bg-white rounded-2xl shadow-xl px-8 py-7 w-[95%] sm:w-[90%]  md:w-180 lg:w-205 mx-auto max-h-[90vh] overflow-y-auto"
    >
      {/* TITLE */}
      <div className="text-center mb-2">
        <h2 className="text-xl font-bold text-blue-900">
          Form Pengurusan Kendaraan
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Silakan lengkapi data kendaraan Anda
        </p>
      </div>

      {/* JENIS LAYANAN */}
      <div>
        <label className="text-sm font-medium mb-1 block">Jenis Layanan</label>
        <Select
          name="serviceType"
          value={form.serviceType}
          onChange={handleChange}
        >
          <option value="stnk">Perpanjang STNK</option>
          <option value="balik_nama">Balik Nama BPKB</option>
          <option value="mutasi">Mutasi Kendaraan</option>
          <option value="blokir">Blokir Kendaraan</option>
          <option value="request_plat">Request Plat Nomor</option>
        </Select>
      </div>

      {/* Type Kendaraan */}
      <div>
        <label className="text-sm font-medium mb-1 block">Type Kendaraan</label>
        <Select
          name="vehicleType"
          value={form.vehicleType}
          onChange={handleChange}
        >
          <option value="mobil">Mobil</option>
          <option value="motor">Motor</option>
        </Select>
      </div>

      {/* MASA STNK */}
      {isSTNK && (
        <div>
          <label className="text-sm font-medium mb-1 block">Masa STNK</label>
          <Select
            name="duration"
            value={form.duration}
            onChange={handleChange}
          >
            <option value="">Pilih</option>
            <option value="1">1 Tahun</option>
            <option value="5">5 Tahun</option>
          </Select>

          {form.duration === "5" && (
            <p className="text-xs text-red-600 mt-1">
              * STNK 5 Tahun wajib ganti kaleng
            </p>
          )}
        </div>
      )}

      {/* SAMSAT */}
      {isMutation && (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Samsat Asal</label>
            <Input
              name="samsatFrom"
              placeholder="Contoh: Samsat Jakarta Selatan"
              value={form.samsatFrom}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Samsat Tujuan</label>
            <Input
              name="samsatTo"
              placeholder="Contoh: Samsat Bandung"
              value={form.samsatTo}
              onChange={handleChange}
            />
          </div>
        </div>
      )}

      {/* REQUEST PLAT */}
      {isPlate && (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Jumlah Angka Plat</label>
            <Select
              name="plateDigit"
              value={form.plateDigit}
              onChange={handleChange}
            >
              <option value="">Pilih</option>
              <option value="1">1 Angka</option>
              <option value="2">2 Angka</option>
              <option value="3">3 Angka</option>
              <option value="4">4 Angka</option>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Huruf Belakang</label>
            <Select
              name="plateSuffix"
              value={form.plateSuffix}
              onChange={handleChange}
            >
              <option value="">Pilih</option>
              <option value="no">Tanpa Huruf</option>
              <option value="yes">Dengan Huruf</option>
            </Select>
          </div>

          {getPlatePrice() && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
              Estimasi Biaya:{" "}
              <strong className="text-blue-700">{getPlatePrice()}</strong>
            </div>
          )}
        </div>
      )}

      {/* DATA KENDARAAN UMUM */}
      <div>
        <label className="text-sm font-medium mb-1 block">
          Nomor Plat Kendaraan (Depok)
        </label>

        <div className="flex">
          {/* FIXED PLATE */}
          <span className="inline-flex items-center px-4 border border-r-0 rounded-l-lg bg-gray-100 text-gray-700 font-semibold border-gray-300">
            B
          </span>

          {/* USER INPUT */}
          <Input
            name="plateNumber"
            placeholder="1234 XYZ"
            value={form.plateNumber}
            onChange={handleChange}
            className="rounded-l-none uppercase"
          />
        </div>

        <p className="text-xs text-blue-600 mt-1">
          * Khusus wilayah Depok (Plat B – Jawa Barat)
        </p>
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Tahun Kendaraan</label>
        <Select
          name="vehicleYear"
          value={form.vehicleYear}
          onChange={handleChange}
        >
          <option value="">Pilih Tahun</option>
          {vehicleYears.map((year) => (
            <option key={year} value={year.toString()}>
              {year}
            </option>
          ))}
        </Select>
      </div>

      <Button
        type="submit"
        className="w-full py-3"
      >
        Kirim Form
      </Button>
    </form>
  );
}
