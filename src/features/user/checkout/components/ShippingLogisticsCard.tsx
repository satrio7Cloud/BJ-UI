import {
  Building2,
  Check,
  CheckCircle2,
  Copy,
  Info,
  Loader2,
  MapPin,
  Package,
  Send,
  Truck,
} from "lucide-react";
import { useState } from "react";
import {
  DEFAULT_OFFICE_PROFILE,
  type CompanyProfile,
} from "../../../../api/companyProfile";
import { type ShippingRate } from "../../../../api/shipping";
import { useCompanyProfile } from "../../../../shared/hooks/useCompanyProfile";
import { type CheckoutFormData, type ShippingScenario } from "../types";

interface ShippingLogisticsCardProps {
  formData: CheckoutFormData;
  setFormData: React.Dispatch<React.SetStateAction<CheckoutFormData>>;
  shippingRates: ShippingRate[];
  selectedCourierCompany: string;
  setSelectedCourierCompany: (company: string) => void;
  selectedRate: ShippingRate | null;
  setSelectedRate: (rate: ShippingRate) => void;
  isLoadingRates: boolean;
  isServiceInherentlyNameTransfer: boolean;
  officeProfile?: CompanyProfile;
}

export default function ShippingLogisticsCard({
  formData,
  setFormData,
  shippingRates,
  selectedCourierCompany,
  setSelectedCourierCompany,
  selectedRate,
  setSelectedRate,
  isLoadingRates,
  isServiceInherentlyNameTransfer,
  officeProfile: propOfficeProfile,
}: ShippingLogisticsCardProps) {
  const { profile: hookOfficeProfile } = useCompanyProfile();
  const currentOfficeProfile =
    propOfficeProfile || hookOfficeProfile || DEFAULT_OFFICE_PROFILE;

  const displayOfficeAddress = currentOfficeProfile.full_address
    ? currentOfficeProfile.post_code &&
      !currentOfficeProfile.full_address.includes(
        currentOfficeProfile.post_code,
      )
      ? `${currentOfficeProfile.full_address}, ${currentOfficeProfile.post_code}`
      : currentOfficeProfile.full_address
    : DEFAULT_OFFICE_PROFILE.full_address;

  const [isSameAddress, setIsSameAddress] = useState(
    !formData.return_address ||
      formData.return_address === formData.pickup_address,
  );
  const [copied, setCopied] = useState(false);

  const handleCopyOfficeAddress = () => {
    navigator.clipboard.writeText(displayOfficeAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scenarios: {
    id: ShippingScenario;
    title: string;
    badge: string;
    badgeColor: string;
    incoming: string;
    outgoing: string;
    feeDescription: string;
    icon: any;
  }[] = [
    {
      id: "A",
      title: "Door-to-Door",
      badge: "Paling Praktis",
      badgeColor: "bg-emerald-600 text-white",
      incoming: "Dijemput Kurir di Alamat Anda",
      outgoing: "Diantar Kurir Kembali",
      feeDescription: "Tarif Kurir 2 Arah (PP)",
      icon: Truck,
    },
    {
      id: "B",
      title: "Office Drop-off",
      badge: "Hemat Ongkir",
      badgeColor: "bg-blue-600 text-white",
      incoming: "Diantar Sendiri ke Kantor (Rp 0)",
      outgoing: "Dikirim Kurir Kembali",
      feeDescription: "Tarif Kurir 1 Arah Pulang",
      icon: Package,
    },
    {
      id: "C",
      title: "Send-in Ekspedisi",
      badge: "Bisa Luar Kota",
      badgeColor: "bg-amber-600 text-white",
      incoming: "Kirim via Ekspedisi Luar (Rp 0 di web)",
      outgoing: "Dikirim Kurir Kembali",
      feeDescription: "Tarif Kurir 1 Arah Pulang",
      icon: Send,
    },
    {
      id: "D",
      title: "Walk-in Mandiri",
      badge: "Bebas Ongkir",
      badgeColor: "bg-purple-600 text-white",
      incoming: "Datang Sendiri ke Kantor (Rp 0)",
      outgoing: "Ambil Sendiri di Kantor (Rp 0)",
      feeDescription: "Rp 0 (Bebas Ongkir)",
      icon: Building2,
    },
  ];

  const currentScenario =
    scenarios.find((s) => s.id === formData.shipping_scenario) || scenarios[0];

  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Truck className="w-5 h-5 text-emerald-600" />
          Pengiriman & Catatan
        </h2>
      </div>

      {/* 1. Pemilihan 4 Skenario Pengiriman */}
      <div className="space-y-3">
        <label className="block text-sm font-bold text-slate-800">
          Pilih Metode Pengiriman & Penyerahan Dokumen:
        </label>
        <div className="grid sm:grid-cols-2 gap-3.5">
          {scenarios.map((sc) => {
            const isSelected = formData.shipping_scenario === sc.id;
            const Icon = sc.icon;
            return (
              <div
                key={sc.id}
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    shipping_scenario: sc.id,
                  }))
                }
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? "bg-emerald-50/40 border-emerald-600 shadow-sm ring-2 ring-emerald-500/20"
                    : "bg-white border-slate-200 hover:border-emerald-300 hover:bg-slate-50/50"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-slate-900 text-sm">
                        {sc.title}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${sc.badgeColor}`}
                    >
                      {sc.badge}
                    </span>
                  </div>

                  <div className="text-xs space-y-1 text-slate-600 pl-10 mb-3">
                    <p>
                      <b className="text-slate-700">Masuk:</b> {sc.incoming}
                    </p>
                    <p>
                      <b className="text-slate-700">Selesai:</b> {sc.outgoing}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs pl-2">
                  <span className="font-semibold text-emerald-800">
                    {sc.feeDescription}
                  </span>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Banner Informasi Skenario Terpilih */}
      <div className="p-4.5 bg-linear-to-br from-emerald-50/70 via-teal-50/30 to-slate-50 border border-emerald-200/90 rounded-2xl flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
          <currentScenario.icon className="w-4.5 h-4.5" />
        </div>
        <div className="space-y-1 text-xs leading-relaxed text-slate-600">
          <h4 className="font-bold text-slate-900 text-sm">
            {currentScenario.title} — {currentScenario.badge}
          </h4>
          {formData.shipping_scenario === "A" && (
            <p>
              Dokumen fisik kendaraan (STNK/BPKB/KTP) akan{" "}
              <b>dijemput oleh kurir</b> di alamat Anda ke kantor kami, dan
              setelah selesai diproses akan <b>diantar kembali</b> ke alamat
              yang sama. Tarif pengiriman mencakup{" "}
              <b>total 2 arah perjalanan (PP)</b>.
            </p>
          )}
          {formData.shipping_scenario === "B" && (
            <p>
              Anda <b>mengantarkan sendiri</b> berkas fisik kendaraan ke kantor
              kami (bebas biaya jemput). Setelah berkas selesai diproses di
              Samsat, dokumen resmi akan <b>dikirimkan oleh kurir</b> ke alamat
              Anda (hanya dikenakan <b>ongkir 1 arah pulang</b>).
            </p>
          )}
          {formData.shipping_scenario === "C" && (
            <p>
              Anda <b>mengirimkan berkas sendiri via ekspedisi luar</b> (seperti
              JNE, SiCepat, J&T, GoSend) langsung ke alamat kantor kami. Setelah
              berkas selesai diproses, dokumen resmi akan{" "}
              <b>dikirimkan kurir</b> ke alamat Anda (hanya dikenakan{" "}
              <b>ongkir 1 arah pulang</b>).
            </p>
          )}
          {formData.shipping_scenario === "D" && (
            <p>
              Seluruh proses penyerahan berkas fisik dan pengambilan dokumen
              resmi dilakukan <b>langsung di kantor kami oleh Anda sendiri</b>.
              Anda{" "}
              <b>
                tidak dikenakan biaya kurir / ongkos kirim (Rp 0 Bebas Ongkir)
              </b>
              .
            </p>
          )}
        </div>
      </div>

      {/* Catatan Terkait Cek Fisik / Gesek Nomor Rangka & Mesin */}
      <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex items-start gap-2.5 text-xs text-amber-950">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <b>Catatan Fisik Kendaraan:</b> Layanan kurir di atas hanya bertugas
          menjemput dan mengantar <b>dokumen fisik</b> (STNK/BPKB/KTP). Khusus
          layanan yang memerlukan cek fisik (Pajak 5 Tahunan & STNK Hilang),
          proses gesek nomor rangka & mesin dapat dilakukan di wilayah Depok
          atau dengan <b>janjian bertemu langsung di Samsat Pusat</b> bersama
          tim kami.
        </p>
      </div>

      {/* 3. Kartu Info Alamat Kantor Biro Jasa (Ditampilkan pada Skenario B, C, dan D) */}
      {formData.shipping_scenario !== "A" && (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-600" />
              Alamat Kantor{" "}
              {currentOfficeProfile.office_name
                ? `(${currentOfficeProfile.office_name})`
                : "Biro Jasa"}
              :
            </span>
            <button
              type="button"
              onClick={handleCopyOfficeAddress}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold cursor-pointer inline-flex items-center gap-1"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Alamat</span>
                </>
              )}
            </button>
          </div>
          <div className="p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 space-y-1">
            <p className="font-semibold text-slate-900">
              {displayOfficeAddress}
            </p>
            <p className="text-slate-500">
              🕒 Jam Operasional:{" "}
              <b>
                {currentOfficeProfile.operational_hours ||
                  "Senin – Sabtu (08:00 – 17:00 WIB)"}
              </b>{" "}
              | 📞 Kontak:{" "}
              <b>{currentOfficeProfile.phone_number || "085156419062"}</b>
            </p>
          </div>
        </div>
      )}

      {/* 4. Input Resi Eksternal (Khusus Skenario C) */}
      {formData.shipping_scenario === "C" && (
        <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-2">
          <label className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
            <Send className="w-3.5 h-3.5 text-amber-600" />
            Nomor Resi / Nama Ekspedisi Pengiriman Berkas Masuk (Opsional)
          </label>
          <input
            type="text"
            placeholder="Contoh: JNE - 0123456789 atau GoSend No. Booking"
            value={formData.customer_tracking_number || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                customer_tracking_number: e.target.value,
              }))
            }
            className="w-full px-4 py-2.5 rounded-xl border border-amber-200 focus:ring-2 focus:ring-amber-500 outline-none bg-white text-sm"
          />
          <p className="text-[11px] text-amber-700 leading-relaxed">
            * Jika paket belum dikirim saat ini, Anda juga dapat mengirimkan
            nomor resi melalui WhatsApp Admin kami setelah pesanan dibuat.
          </p>
        </div>
      )}

      {/* 5. Kurir Ekspedisi Rates Section (Biteship Rates) - Hanya untuk Skenario A, B, C */}
      {formData.shipping_scenario !== "D" ? (
        <div className="p-5 bg-linear-to-br from-slate-50 to-emerald-50/40 border border-emerald-200/80 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-800 text-sm">
                Pilih Ekspedisi & Layanan Ongkir{" "}
                {formData.shipping_scenario === "A"
                  ? "(2 Arah: Jemput & Antar)"
                  : "(1 Arah Pulang)"}
              </h3>
            </div>
            {isLoadingRates && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold animate-pulse">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Menghitung ongkir...
              </div>
            )}
          </div>

          {!formData.postal_code || formData.postal_code.trim().length !== 5 ? (
            <div className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
              <span className="text-base">📍</span>
              <div>
                <b>Kode Pos Diperlukan:</b> Masukkan 5 digit kode pos Anda di
                formulir data pemesan di atas untuk menghitung tarif ongkos
                kirim otomatis.
              </div>
            </div>
          ) : shippingRates.length > 0 ? (
            <div className="space-y-4">
              {/* Filter Tab / Pilihan Ekspedisi */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Pilih Ekspedisi:
                </label>
                <div className="flex flex-wrap gap-2">
                  {Array.from(
                    new Set(shippingRates.map((r) => r.courier_name)),
                  ).map((company) => {
                    const isActive = selectedCourierCompany === company;
                    const count = shippingRates.filter(
                      (r) => r.courier_name === company,
                    ).length;
                    return (
                      <button
                        key={company}
                        type="button"
                        onClick={() => {
                          setSelectedCourierCompany(company);
                          const firstRateOfCompany = shippingRates.find(
                            (r) => r.courier_name === company,
                          );
                          if (firstRateOfCompany) {
                            setSelectedRate(firstRateOfCompany);
                          }
                        }}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                          isActive
                            ? "bg-emerald-900 text-white border-emerald-900 shadow-sm"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        <span>{company}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                            isActive
                              ? "bg-emerald-800 text-emerald-200"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Daftar Layanan dari Ekspedisi Terpilih Saja */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Pilihan Layanan {selectedCourierCompany}:
                </label>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {shippingRates
                    .filter(
                      (rate) => rate.courier_name === selectedCourierCompany,
                    )
                    .map((rate, idx) => {
                      const isSelected =
                        selectedRate?.courier_name === rate.courier_name &&
                        selectedRate?.courier_service_name ===
                          rate.courier_service_name;
                      const multiplier =
                        formData.shipping_scenario === "A" ? 2 : 1;
                      const calculatedPrice = rate.price * multiplier;

                      return (
                        <div
                          key={`${rate.courier_name}-${rate.courier_service_name}-${idx}`}
                          onClick={() => setSelectedRate(rate)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? "bg-white border-emerald-600 shadow-md ring-2 ring-emerald-500/20"
                              : "bg-white border-slate-200 hover:border-emerald-300 hover:shadow-xs"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1 mb-2">
                            <div>
                              <div className="inline-block px-2 py-0.5 rounded-md bg-emerald-50 text-[11px] font-bold text-emerald-800 mb-1 border border-emerald-100">
                                {rate.courier_name}
                              </div>
                              <p className="text-xs font-bold text-slate-800 line-clamp-1">
                                {rate.courier_service_name}
                              </p>
                            </div>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            )}
                          </div>
                          <div>
                            <p className="font-extrabold text-emerald-700 text-base">
                              Rp {calculatedPrice.toLocaleString("id-ID")}
                            </p>
                            <p className="text-[10px] text-slate-500 font-medium">
                              {formData.shipping_scenario === "A"
                                ? `Rp ${rate.price.toLocaleString("id-ID")} × 2 arah (Jemput & Antar)`
                                : `Tarif 1 arah pengantaran pulang`}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          ) : !isLoadingRates ? (
            <div className="text-xs text-slate-500 text-center py-4 bg-white rounded-xl border border-slate-200">
              Tarif ekspedisi tidak ditemukan untuk kode pos{" "}
              {formData.postal_code}. Pastikan kode pos sudah sesuai.
            </div>
          ) : null}
        </div>
      ) : (
        <div className="p-4.5 bg-purple-50/70 border border-purple-200 rounded-2xl flex items-center justify-between text-xs text-purple-950">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0" />
            <div>
              <p className="font-bold text-sm text-purple-900">
                Walk-in Mandiri (Bebas Ongkir)
              </p>
              <p className="text-purple-700">
                Tidak membutuhkan kurir pengiriman. Serah terima berkas fisik
                dan pengambilan dilakukan langsung di kantor.
              </p>
            </div>
          </div>
          <span className="font-extrabold text-emerald-700 text-sm px-3 py-1 rounded-full bg-white border border-purple-200 shrink-0">
            Rp 0
          </span>
        </div>
      )}

      {/* 6. Form Alamat Penjemputan (Hanya untuk Skenario A) */}
      {formData.shipping_scenario === "A" && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" />
              Alamat Penjemputan Dokumen
            </label>
            {formData.address &&
              formData.pickup_address !== formData.address && (
                <button
                  type="button"
                  onClick={() => {
                    const addr = formData.address;
                    setFormData((prev) => ({
                      ...prev,
                      pickup_address: addr,
                      return_address: isSameAddress
                        ? addr
                        : prev.return_address,
                    }));
                  }}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold cursor-pointer underline"
                >
                  Gunakan Alamat Domisili
                </button>
              )}
          </div>
          <p className="text-xs text-slate-500">
            Lokasi kurir menjemput berkas fisik asli Anda (STNK / BPKB / KTP)
            untuk diantar ke kantor kami.
          </p>
          <textarea
            placeholder="Detail alamat lengkap penjemputan berkas oleh kurir..."
            rows={2}
            value={formData.pickup_address}
            onChange={(e) => {
              const val = e.target.value;
              setFormData((prev) => ({
                ...prev,
                pickup_address: val,
                return_address: isSameAddress ? val : prev.return_address,
              }));
            }}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white text-sm"
          />
        </div>
      )}

      {/* 7. Form Alamat Pengembalian Dokumen (Untuk Skenario A, B, C) */}
      {formData.shipping_scenario !== "D" ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-emerald-600" />
              Alamat Pengembalian Dokumen
            </label>
            {formData.shipping_scenario === "A" ? (
              <label className="inline-flex items-center gap-2 text-xs text-slate-600 font-medium cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isSameAddress}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setIsSameAddress(checked);
                    if (checked) {
                      setFormData((prev) => ({
                        ...prev,
                        return_address: prev.pickup_address,
                      }));
                    }
                  }}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                />
                Sama dengan alamat penjemputan
              </label>
            ) : (
              formData.address &&
              formData.return_address !== formData.address && (
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      return_address: prev.address,
                    }));
                  }}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold cursor-pointer underline"
                >
                  Gunakan Alamat Domisili
                </button>
              )
            )}
          </div>
          <p className="text-xs text-slate-500">
            Lokasi tujuan pengantaran berkas asli setelah selesai diproses di
            Samsat.
          </p>
          {formData.shipping_scenario !== "A" || !isSameAddress ? (
            <textarea
              placeholder="Detail alamat pengembalian dokumen oleh kurir..."
              rows={2}
              value={formData.return_address || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  return_address: e.target.value,
                }))
              }
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white text-sm"
            />
          ) : (
            <div className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
              <span>
                {formData.pickup_address ? (
                  <>
                    <b className="text-slate-700">Dikembalikan ke:</b>{" "}
                    {formData.pickup_address}
                  </>
                ) : (
                  <span className="italic text-slate-400">
                    Otomatis mengikuti alamat penjemputan dokumen di atas
                  </span>
                )}
              </span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                Alamat Sama
              </span>
            </div>
          )}
        </div>
      ) : null}

      {/* 8. Catatan Tambahan */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-700">
          Catatan Tambahan
        </label>
        <textarea
          placeholder="Contoh: Tolong diproses cepat ya mas..."
          rows={2}
          value={formData.notes}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, notes: e.target.value }))
          }
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white text-sm"
        />
      </div>

      {/* 9. Balik Nama / Mutasi Checkbox */}
      <div className="flex items-center gap-3 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
        <input
          type="checkbox"
          id="nameTransfer"
          checked={
            formData.is_name_transfer_required ||
            isServiceInherentlyNameTransfer
          }
          disabled={isServiceInherentlyNameTransfer}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              is_name_transfer_required: e.target.checked,
            }))
          }
          className="w-5 h-5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 disabled:opacity-50"
        />
        <label
          htmlFor="nameTransfer"
          className={`text-sm font-semibold text-emerald-900 cursor-pointer ${
            isServiceInherentlyNameTransfer ? "opacity-50" : ""
          }`}
        >
          Perlu Mutasi / Balik Nama Kendaraan{" "}
          {isServiceInherentlyNameTransfer && "(Sudah Termasuk)"}
        </label>
      </div>

      {(isServiceInherentlyNameTransfer ||
        formData.is_name_transfer_required) && (
        <div className="grid sm:grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Samsat Asal (Kota Asal Kendaraan)
            </label>
            <input
              type="text"
              placeholder="Contoh: SAMSAT Jakarta Timur"
              value={formData.samsat_origin}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  samsat_origin: e.target.value,
                }))
              }
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Samsat Tujuan (Mutasi Ke)
            </label>
            <input
              type="text"
              placeholder="Contoh: SAMSAT Bandung Barat"
              value={formData.samsat_destination}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  samsat_destination: e.target.value,
                }))
              }
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
}
