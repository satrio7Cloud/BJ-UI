import { CheckCircle2, Loader2, Package, Truck } from "lucide-react";
import { type ShippingRate } from "../../../../api/shipping";
import { type CheckoutFormData } from "../types";

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
}: ShippingLogisticsCardProps) {
  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Truck className="w-5 h-5 text-emerald-600" />
        Pengiriman & Catatan
      </h2>
      <div className="grid sm:grid-cols-2 gap-6">
        {/* Skenario A (Full Kurir) Info Banner */}
        <div className="sm:col-span-2 p-5 bg0linear-to-br from-emerald-50 via-teal-50/50 to-slate-50 border border-emerald-200/90 rounded-2xl flex items-start gap-3.5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Truck className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-sm">
                Skenario A: Layanan Full Kurir (Antar & Jemput 2 Arah)
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-xs">
                Paling Praktis
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dokumen fisik kendaraan (STNK/BPKB/KTP) akan <b>dijemput oleh kurir</b> di alamat Anda ke kantor kami, dan setelah selesai diproses di Samsat akan <b>diantar kembali</b> ke alamat yang sama. Tarif pengiriman di bawah sudah mencakup <b>total 2 arah perjalanan</b>.
            </p>
          </div>
        </div>

        {/* Kurir Ekspedisi Rates Section (Biteship Rates) */}
        <div className="sm:col-span-2 p-5 bg-linear-to-br from-slate-50 to-emerald-50/40 border border-emerald-200/80 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-800 text-sm">
                Pilih Ekspedisi & Layanan Ongkir (2 Arah)
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
                <b>Kode Pos Diperlukan:</b> Masukkan 5 digit kode pos Anda di formulir data pemesan di atas untuk menghitung tarif ongkos kirim otomatis.
              </div>
            </div>
          ) : shippingRates.length > 0 ? (
            <div className="space-y-4">
              {/* 1. Filter Tab / Pilihan Ekspedisi (JNE, SiCepat, AnterAja, dll) */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Pilih Ekspedisi:
                </label>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(shippingRates.map((r) => r.courier_name))).map((company) => {
                    const isActive = selectedCourierCompany === company;
                    const count = shippingRates.filter((r) => r.courier_name === company).length;
                    return (
                      <button
                        key={company}
                        type="button"
                        onClick={() => {
                          setSelectedCourierCompany(company);
                          const firstRateOfCompany = shippingRates.find((r) => r.courier_name === company);
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

              {/* 2. Daftar Layanan dari Ekspedisi Terpilih Saja */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Pilihan Layanan {selectedCourierCompany}:
                </label>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {shippingRates
                    .filter((rate) => rate.courier_name === selectedCourierCompany)
                    .map((rate, idx) => {
                      const isSelected =
                        selectedRate?.courier_name === rate.courier_name &&
                        selectedRate?.courier_service_name === rate.courier_service_name;
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
                              Rp {(rate.price * 2).toLocaleString("id-ID")}
                            </p>
                            <p className="text-[10px] text-slate-500 font-medium">
                              Rp {rate.price.toLocaleString("id-ID")} × 2 arah (Jemput & Antar)
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
              Tarif ekspedisi tidak ditemukan untuk kode pos {formData.postal_code}. Pastikan kode pos sudah sesuai.
            </div>
          ) : null}
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Alamat Penjemputan & Pengembalian Dokumen
          </label>
          <textarea
            placeholder="Detail alamat lengkap Anda untuk penjemputan dan pengantaran kembali dokumen..."
            rows={2}
            value={formData.pickup_address}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, pickup_address: e.target.value }))
            }
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Catatan Tambahan (Opsional)
          </label>
          <textarea
            placeholder="Contoh: Tolong diproses cepat ya mas..."
            rows={2}
            value={formData.notes}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, notes: e.target.value }))
            }
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white"
          />
        </div>
        <div className="sm:col-span-2 flex items-center gap-3 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
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
          <div className="sm:col-span-2 grid sm:grid-cols-2 gap-4 mt-1 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
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
    </div>
  );
}
