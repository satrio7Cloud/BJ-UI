import { ArrowLeft, Calculator, Loader2, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { createCustomer } from "../../../../api/customer";
import { createCustomerVehicle } from "../../../../api/customerVehicle";
import { getModels, type VehicleModel } from "../../../../api/vehicle";
import type { Service } from "../../../../data/services";
import Button from "../../../../shared/components/Button";
import { Input } from "../../../../shared/components/Input";
import { Select } from "../../../../shared/components/Select";
import { getDistance } from "../../../../shared/services/mapsService";
import type { Method } from "../../hooks/useShipping";
import Stepper from "../Stepper";

interface Props {
  service: Service;
  shippingMethod: Method;
  onBack: () => void;
  onNext: (data: any, shippingFee: number) => void;
}

const CURRENT_YEAR = new Date().getFullYear();
const vehicleYears = Array.from(
  { length: CURRENT_YEAR - 1999 + 1 },
  (_, i) => CURRENT_YEAR - i
);

export default function StepVehicleForm({
  service,
  shippingMethod,
  onBack,
  onNext,
}: Props) {
  // Helpers to auto-detect details from selected service title & ID
  const autoVehicleType = (() => {
    const titleLower = service.title.toLowerCase();
    const idLower = service.id.toLowerCase();
    if (titleLower.includes("motor") || idLower.includes("motor")) return "motor";
    if (titleLower.includes("mobil") || idLower.includes("mobil")) return "mobil";
    return null;
  })();

  const autoDuration = (() => {
    const titleLower = service.title.toLowerCase();
    const idLower = service.id.toLowerCase();
    if (titleLower.includes("5 tahun") || idLower.includes("5-tahunan")) return "5";
    if (titleLower.includes("tahunan") || idLower.includes("tahunan")) return "1";
    return null;
  })();

  const autoSimType = (() => {
    const titleLower = service.title.toLowerCase();
    const idLower = service.id.toLowerCase();
    if (titleLower.includes("sim mobil") || idLower.includes("sim-mobil") || idLower.includes("sim-a")) return "SIM A";
    if (titleLower.includes("sim motor") || idLower.includes("sim-motor") || idLower.includes("sim-c")) return "SIM C";
    return null;
  })();

  const autoPlateDigit = (() => {
    const titleLower = service.title.toLowerCase();
    const idLower = service.id.toLowerCase();
    if (idLower.includes("plat-1") || titleLower.includes("1 angka")) return "1";
    if (idLower.includes("plat-2") || titleLower.includes("2 angka")) return "2";
    if (idLower.includes("plat-3") || titleLower.includes("3 angka")) return "3";
    if (idLower.includes("plat-4") || titleLower.includes("4 angka")) return "4";
    return null;
  })();

  const autoPlateSuffix = (() => {
    const titleLower = service.title.toLowerCase();
    const idLower = service.id.toLowerCase();
    if (idLower.includes("-no") || titleLower.includes("tanpa huruf")) return "no";
    if (idLower.includes("-yes") || titleLower.includes("dengan huruf")) return "yes";
    return null;
  })();

  // Form State initialized with auto-detected values
  const [formData, setFormData] = useState({
    name: "",
    whatsapp: "",
    address: "",
    vehicleType: autoVehicleType || "mobil",
    duration: autoDuration || "1",
    plateNumber: "",
    vehicleYear: "",
    samsatFrom: "",
    samsatTo: "",
    plateDigit: autoPlateDigit || "",
    plateSuffix: autoPlateSuffix || "",
    simType: autoSimType || "SIM A",
    email: "",
    nik: "",
    modelId: "",
  });

  const [ktpFile, setKtpFile] = useState<File | null>(null);
  const [stnkFile, setStnkFile] = useState<File | null>(null);
  const [bpkbFile, setBpkbFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<File | null>>) => {
    if (e.target.files && e.target.files.length > 0) {
      setter(e.target.files[0]);
    } else {
      setter(null);
    }
  };

  const [models, setModels] = useState<VehicleModel[]>([]);
  useEffect(() => {
    getModels()
      .then(res => setModels(res.data || []))
      .catch(console.error);
  }, []);

  // Distance Calculation State
  const [checkingDistance, setCheckingDistance] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [distanceChecked, setDistanceChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (e.target.name === "address") {
      setDistanceChecked(false);
    }
  };

  const handleCheckDistance = async () => {
    if (!formData.address.trim()) {
      toast.error("Silakan masukkan alamat penjemputan terlebih dahulu");
      return;
    }

    setCheckingDistance(true);
    try {
      const dist = await getDistance(formData.address);
      setDistance(dist);

      if (dist !== null) {
        // Rp 5.000 / km, minimum Rp 15.000
        const fee = Math.max(dist * 5000, 15000);
        const roundedFee = Math.round(fee / 1000) * 1000;
        setShippingFee(roundedFee);
        toast.success(`Jarak terhitung: ${dist.toFixed(1)} km. Estimasi ongkir diperbarui.`);
      } else {
        setShippingFee(0);
        toast("Alamat tidak terdeteksi otomatis. Biaya pengiriman akan dihitung manual.", { icon: "⚠️" });
      }
      setDistanceChecked(true);
    } catch (error) {
      console.error(error);
      setShippingFee(0);
      setDistanceChecked(true);
      toast.error("Gagal memeriksa jarak. Biaya kirim akan ditentukan manual.");
    } finally {
      setCheckingDistance(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Nama lengkap wajib diisi");
      return;
    }
    if (!formData.whatsapp.trim()) {
      toast.error("Nomor WhatsApp wajib diisi");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Email wajib diisi");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Format email tidak valid");
      return;
    }
    if (!formData.nik.trim()) {
      toast.error("NIK wajib diisi");
      return;
    }
    if (formData.nik.trim().length !== 16) {
      toast.error("NIK harus 16 digit");
      return;
    }
    if (!formData.address.trim()) {
      toast.error("Alamat lengkap wajib diisi");
      return;
    }

    if (shippingMethod === "kurir") {
      if (!formData.address.trim()) {
        toast.error("Alamat penjemputan wajib diisi");
        return;
      }
      if (!distanceChecked) {
        toast.error("Silakan klik 'Cek Jarak & Ongkir' terlebih dahulu");
        return;
      }
    }

    // Dynamic field validation
    if (service.category === "STNK") {
      if (!formData.plateNumber.trim()) {
        toast.error("Nomor plat kendaraan wajib diisi");
        return;
      }
      if (!formData.vehicleYear) {
        toast.error("Tahun kendaraan wajib dipilih");
        return;
      }
    }

    const isMutasiService = service.category === "Mutasi" || service.title.toLowerCase().includes("mutasi") || service.title.toLowerCase().includes("cabut berkas");
    const isBpkbService = service.category === "BPKB" || service.title.toLowerCase().includes("bpkb") || service.title.toLowerCase().includes("balik nama");

    if (isMutasiService || isBpkbService) {
      // BPKB/Mutasi/Balik Nama needs plate number
      if (!formData.plateNumber.trim()) {
        toast.error("Nomor plat kendaraan wajib diisi");
        return;
      }
      if (isMutasiService) {
        if (!formData.samsatFrom.trim()) {
          toast.error("Samsat Asal wajib diisi");
          return;
        }
        if (!formData.samsatTo.trim()) {
          toast.error("Samsat Tujuan wajib diisi");
          return;
        }
      }
    }

    if (service.category === "Plat Nomor" && (!autoPlateDigit || !autoPlateSuffix)) {
      if (!formData.plateDigit) {
        toast.error("Jumlah angka plat wajib dipilih");
        return;
      }
      if (!formData.plateSuffix) {
        toast.error("Pilihan huruf belakang wajib dipilih");
        return;
      }
    }

    // Call customer API first
    setIsSubmitting(true);
    toast.promise(
      createCustomer({
        fullname: formData.name,
        email: formData.email,
        phone_number: formData.whatsapp,
        address: formData.address,
        nik: formData.nik,
      }).then(async (res) => {
        let vehicleId = undefined;
        // Create Vehicle if it's not SIM service
        if (service.category !== "SIM" && res.data?.id) {
           if (!formData.modelId) {
             throw new Error("Merek Kendaraan wajib dipilih");
           }
           const vRes = await createCustomerVehicle({
             customer_id: res.data.id,
             model_id: formData.modelId,
             plate_number: formData.plateNumber,
             year: parseInt(formData.vehicleYear) || new Date().getFullYear(),
           });
           vehicleId = vRes.data?.id;
        }
        return { customerId: res.data?.id, vehicleId };
      }),
      {
        loading: "Menyimpan data pelanggan...",
        success: (res) => {
          setIsSubmitting(false);
          // Pass data forward (include customerId and vehicleId for next step if needed)
          onNext(
            {
              ...formData,
              distance,
              customerId: res.customerId,
              vehicleId: res.vehicleId,
              documents: {
                ktp: ktpFile,
                stnk: stnkFile,
                bpkb: bpkbFile,
              }
            },
            shippingFee
          );
          return "Data berhasil disimpan!";
        },
        error: (err) => {
          setIsSubmitting(false);
          console.error("Gagal menyimpan data:", err);
          return err.message || "Gagal menyimpan data. Silakan coba lagi.";
        },
      }
    );
  };

  const hasDetectedInfo =
    autoVehicleType || autoDuration || autoSimType || autoPlateDigit || autoPlateSuffix;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col w-full bg-white"
    >
      {/* HEADER */}
      <div className="flex items-center gap-3 p-5 border-b">
        <ArrowLeft onClick={onBack} className="cursor-pointer text-gray-600 hover:text-gray-900" />
        <div>
          <h2 className="text-lg font-semibold">Lengkapi Data Berkas</h2>
          <p className="text-sm text-gray-500">{service.title}</p>
        </div>
      </div>

      <Stepper currentStep={3} />

      {/* BODY */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* DATA PENGIRIM */}
        <div className="space-y-4">
          <h3 className="font-semibold text-blue-900 text-sm border-b pb-1">Data Kontak & Berkas Pelanggan</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Nama Lengkap</label>
              <Input
                name="name"
                placeholder="Contoh: Budi Santoso"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Nomor WhatsApp</label>
              <Input
                name="whatsapp"
                placeholder="Contoh: 08123456789"
                value={formData.whatsapp}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Email</label>
              <Input
                name="email"
                type="email"
                placeholder="Contoh: budi.santoso@gmail.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">NIK (Nomor Induk Kependudukan)</label>
              <Input
                name="nik"
                placeholder="Contoh: 3171012345670001"
                value={formData.nik}
                onChange={handleChange}
                maxLength={16}
              />
            </div>
          </div>
          {shippingMethod !== "kurir" && (
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Alamat Lengkap</label>
              <textarea
                name="address"
                placeholder="Masukkan alamat lengkap sesuai KTP (Jalan, No, RT/RW, Kelurahan, Kecamatan, Kota)"
                value={formData.address}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                rows={3}
              />
            </div>
          )}
        </div>

        {/* ALAMAT PENJEMPUTAN (JIKA KURIR) */}
        {shippingMethod === "kurir" && (
          <div className="space-y-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
            <h3 className="font-semibold text-blue-900 text-sm flex items-center gap-1.5">
              <MapPin size={16} /> Alamat Penjemputan Kurir
            </h3>
            <div>
              <textarea
                name="address"
                placeholder="Masukkan alamat penjemputan lengkap (Jalan, No, RT/RW, Kelurahan, Kecamatan, Kota)"
                value={formData.address}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                rows={3}
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={handleCheckDistance}
                disabled={checkingDistance}
                className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg transition disabled:opacity-50 cursor-pointer"
              >
                {checkingDistance ? (
                  <>
                    <Loader2 className="animate-spin" size={14} /> Memeriksa...
                  </>
                ) : (
                  <>
                    <Calculator size={14} /> Cek Jarak & Ongkir
                  </>
                )}
              </button>

              {distanceChecked && (
                <div className="text-xs text-right">
                  {distance !== null ? (
                    <p className="text-gray-700">
                      Jarak: <span className="font-bold text-blue-700">{distance.toFixed(1)} km</span> | Est. Ongkir:{" "}
                      <span className="font-bold text-green-700">Rp {shippingFee.toLocaleString("id-ID")}</span>
                    </p>
                  ) : (
                    <p className="text-orange-700 font-medium italic">
                      * Jarak tidak terdeteksi. Ongkir dihitung manual.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* DETAIL DYNAMIC FIELDS KENDARAAN */}
        <div className="space-y-4 pt-2">
          <h3 className="font-semibold text-blue-900 text-sm border-b pb-1">Detail Kendaraan & Berkas</h3>

          {/* AUTO DETECTED INFORMATION BADGES */}
          {hasDetectedInfo && (
            <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border border-gray-200 rounded-xl">
              <span className="text-[11px] text-gray-400 font-semibold w-full uppercase tracking-wider mb-0.5">
                Detail Layanan yang Dipilih:
              </span>
              {autoVehicleType && (
                <span className="bg-blue-50 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-md border border-blue-100 capitalize">
                  Jenis: {formData.vehicleType}
                </span>
              )}
              {autoDuration && (
                <span className="bg-blue-50 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-md border border-blue-100">
                  Masa Pajak: {formData.duration} Tahun
                </span>
              )}
              {autoSimType && (
                <span className="bg-blue-50 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-md border border-blue-100">
                  Tipe SIM: {formData.simType}
                </span>
              )}
              {autoPlateDigit && (
                <span className="bg-blue-50 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-md border border-blue-100">
                  Jumlah Angka: {formData.plateDigit} Angka
                </span>
              )}
              {autoPlateSuffix && (
                <span className="bg-blue-50 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-md border border-blue-100">
                  Huruf Suffix: {formData.plateSuffix === "yes" ? "Dengan Huruf" : "Tanpa Huruf"}
                </span>
              )}
            </div>
          )}

          {/* DYNAMIC CASE: STNK */}
          {service.category === "STNK" && (
            <div className="space-y-4">
              {/* Only show select fields if they could not be auto-detected */}
              {(!autoVehicleType || !autoDuration) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {!autoVehicleType && (
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1 block">Tipe Kendaraan</label>
                      <Select
                        name="vehicleType"
                        value={formData.vehicleType}
                        onChange={handleChange}
                      >
                        <option value="mobil">Mobil</option>
                        <option value="motor">Motor</option>
                      </Select>
                    </div>
                  )}

                  {!autoDuration && (
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1 block">Masa Pajak STNK</label>
                      <Select
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                      >
                        <option value="1">1 Tahun</option>
                        <option value="5">5 Tahun (Ganti Kaleng)</option>
                      </Select>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Merek Kendaraanx</label>
                  <Select
                    name="modelId"
                    value={formData.modelId}
                    onChange={handleChange}
                  >
                    <option value="">Pilih Merek Kendaraan</option>
                    {models
                      .filter(m => !formData.vehicleType || m.vehicle_type === formData.vehicleType)
                      .map(model => (
                        <option key={model.id} value={model.id}>{model.model_name}</option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Nomor Plat Kendaraan</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-4 border border-r-0 rounded-l-lg bg-gray-100 text-gray-700 font-semibold border-gray-300">
                      B
                    </span>
                    <Input
                      name="plateNumber"
                      placeholder="1234 XYZ"
                      value={formData.plateNumber}
                      onChange={handleChange}
                      className="rounded-l-none uppercase"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Tahun Kendaraan</label>
                  <Select
                    name="vehicleYear"
                    value={formData.vehicleYear}
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
              </div>
            </div>
          )}

          {/* DYNAMIC CASE: MUTASI / BPKB */}
          {(service.category === "Mutasi" || service.category === "BPKB") && (
            <div className="space-y-4">
              {/* Only show plate number field if it is not a pure SIM or document loss (wait, BPKB/Mutasi generally needs plate number) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Merek Kendaraan</label>
                  <Select
                    name="modelId"
                    value={formData.modelId}
                    onChange={handleChange}
                  >
                    <option value="">Pilih Merek Kendaraan</option>
                    {models
                      .filter(m => !formData.vehicleType || m.vehicle_type === formData.vehicleType)
                      .map(model => (
                        <option key={model.id} value={model.id}>{model.model_name}</option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Nomor Plat Kendaraan</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-4 border border-r-0 rounded-l-lg bg-gray-100 text-gray-700 font-semibold border-gray-300">
                      B
                    </span>
                    <Input
                      name="plateNumber"
                      placeholder="1234 XYZ"
                      value={formData.plateNumber}
                      onChange={handleChange}
                      className="rounded-l-none uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* Show Samsat inputs for Mutasi / Cabut Berkas */}
              {(service.category === "Mutasi" || service.title.toLowerCase().includes("mutasi") || service.title.toLowerCase().includes("cabut berkas")) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Samsat Asal</label>
                    <Input
                      name="samsatFrom"
                      placeholder="Contoh: Samsat Jakarta Selatan"
                      value={formData.samsatFrom}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Samsat Tujuan</label>
                    <Input
                      name="samsatTo"
                      placeholder="Contoh: Samsat Bandung"
                      value={formData.samsatTo}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* DYNAMIC CASE: SIM */}
          {service.category === "SIM" && !autoSimType && (
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Tipe Pengurusan SIM</label>
              <Select
                name="simType"
                value={formData.simType}
                onChange={handleChange}
              >
                <option value="SIM A">SIM A (Mobil)</option>
                <option value="SIM C">SIM C (Motor)</option>
              </Select>
            </div>
          )}

          {/* DYNAMIC CASE: PLAT NOMOR CANTIK */}
          {service.category === "Plat Nomor" && (!autoPlateDigit || !autoPlateSuffix) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {!autoPlateDigit && (
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Jumlah Angka Plat</label>
                  <Select
                    name="plateDigit"
                    value={formData.plateDigit}
                    onChange={handleChange}
                  >
                    <option value="">Pilih</option>
                    <option value="1">1 Angka</option>
                    <option value="2">2 Angka</option>
                    <option value="3">3 Angka</option>
                    <option value="4">4 Angka</option>
                  </Select>
                </div>
              )}

              {!autoPlateSuffix && (
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Huruf Belakang</label>
                  <Select
                    name="plateSuffix"
                    value={formData.plateSuffix}
                    onChange={handleChange}
                  >
                    <option value="">Pilih</option>
                    <option value="no">Tanpa Huruf</option>
                    <option value="yes">Dengan Huruf</option>
                  </Select>
                </div>
              )}
            </div>
          )}
        </div>

        {/* UNGGAH DOKUMEN (OPSIONAL) */}
        <div className="space-y-4 pt-2">
          <h3 className="font-semibold text-blue-900 text-sm border-b pb-1">Unggah Dokumen (Opsional)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Foto KTP (Opsional)</label>
              <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, setKtpFile)} className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Foto STNK (Opsional)</label>
              <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, setStnkFile)} className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Foto BPKB (Opsional)</label>
              <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, setBpkbFile)} className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
            </div>
          </div>
        </div>

      </div>

      {/* FOOTER */}
      <div className="p-5 border-t">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 rounded-xl flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={18} /> Memproses...
            </>
          ) : (
            "Lanjutkan"
          )}
        </Button>
      </div>
    </form>
  );
}
