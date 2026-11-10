import { Calculator } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getServices, type ApiService } from "../../../../api/services";
import TaxCalculatorForm, {
  type CalculatorFormData,
  type NopolParts,
} from "./calculator/TaxCalculatorForm";
import TaxEstimateResult, {
  type CalculatedResult,
} from "./calculator/TaxEstimateResult";

export default function TaxCalculatorSection() {
  const navigate = useNavigate();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [formData, setFormData] = useState<CalculatorFormData>({
    pajakStnk: "",
    nopol: "",
    tahunKendaraan: new Date().getFullYear().toString(),
    nik: "",
    jenisKendaraan: "motor",
    serviceId: "",
  });

  const [nopolParts, setNopolParts] = useState<NopolParts>({
    p1: "",
    p2: "",
    p3: "",
  });
  const [services, setServices] = useState<ApiService[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [calculatedResult, setCalculatedResult] =
    useState<CalculatedResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getServices()
      .then((res) => {
        if (isMounted) setServices(res.data || []);
      })
      .catch(() => {
        if (isMounted) toast.error("Gagal memuat layanan");
      })
      .finally(() => {
        if (isMounted) setLoadingServices(false);
      });

    return () => {
      isMounted = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCalculating) return;

    // Validasi input
    const pkb = parseFloat(formData.pajakStnk.replace(/\D/g, "")) || 0;
    if (pkb <= 0) {
      toast.error(
        "Silakan masukkan nominal PKB (Pajak Kendaraan Bermotor) dari STNK Anda",
      );
      return;
    }

    if (
      !formData.nopol.trim() ||
      !/^[A-Z]{1,2}\s?[0-9]{1,4}\s?[A-Z]{1,3}$/i.test(formData.nopol.trim())
    ) {
      toast.error("Format Nomor Polisi tidak valid. Contoh: B 1234 ABC");
      return;
    }

    if (!formData.nik.trim() || formData.nik.trim().length !== 16) {
      toast.error("NIK / Nomor KTP harus 16 digit angka");
      return;
    }

    const yearInt = parseInt(formData.tahunKendaraan, 10);
    if (
      isNaN(yearInt) ||
      yearInt < 1990 ||
      yearInt > new Date().getFullYear()
    ) {
      toast.error(
        `Tahun kendaraan harus antara 1990 dan ${new Date().getFullYear()}`,
      );
      return;
    }

    const selectedService = services.find((s) => s.id === formData.serviceId);
    if (!selectedService) {
      toast.error("Silakan pilih Tipe Pengurusan Pajak");
      return;
    }

    setIsCalculating(true);

    // Simulasi loading kalkulasi dengan cleanup timer
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const swdkllj = selectedService.swdkllj_fee;
      const biayaJasa = selectedService.service_fee;
      const adminFee = selectedService.admin_fee;
      const physicalCheckFee = selectedService.physical_check_fee;
      const totalEstimasi =
        pkb + swdkllj + biayaJasa + adminFee + physicalCheckFee;

      setCalculatedResult({
        pkb,
        swdkllj,
        biayaJasa,
        adminFee,
        physicalCheckFee,
        totalEstimasi,
        isValidated: true,
      });

      setIsCalculating(false);
      toast.success("Berhasil dihitung! Cek estimasi biaya kendaraan Anda.");
    }, 1000);
  };

  const handleProceedToCheckout = () => {
    if (!calculatedResult) return;

    const selectedService = services.find((s) => s.id === formData.serviceId);
    if (!selectedService) {
      toast.error("Layanan tidak ditemukan");
      return;
    }

    // Alur langsung menuju ke Formulir Pengisian Data Checkout (Step 1)
    navigate("/checkout", {
      state: {
        checkoutData: {
          service: selectedService,
          pkg: "reguler",
          price: calculatedResult.totalEstimasi,
        },
        prefill: {
          nopol: formData.nopol.toUpperCase(),
          nik: formData.nik,
          tahun: formData.tahunKendaraan,
          pajakStnk: calculatedResult.pkb,
          jenisKendaraan: formData.jenisKendaraan,
          serviceId: formData.serviceId,
          estimasiPajakTotal:
            calculatedResult.totalEstimasi - calculatedResult.biayaJasa,
        },
      },
    });
  };

  return (
    <section
      id="cek-pajak"
      className="py-12 sm:py-20 md:py-24 relative overflow-hidden bg-transparent"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4 shadow-xs">
            <Calculator className="w-3.5 h-3.5 text-emerald-600" />
            Kalkulator Pajak Kendaraan
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-3 sm:mb-4 leading-tight">
            Cek Estimasi Pajak &amp; Biaya Layanan
          </h2>
          <p className="text-slate-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto">
            Hitung estimasi total biaya perpanjangan pajak kendaraan Anda berdasarkan data di STNK secara transparan sebelum memesan.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Kolom Kiri: Form Input Data STNK & Validasi */}
          <TaxCalculatorForm
            formData={formData}
            setFormData={setFormData}
            nopolParts={nopolParts}
            setNopolParts={setNopolParts}
            services={services}
            loadingServices={loadingServices}
            isCalculating={isCalculating}
            onSubmit={handleCalculate}
          />

          {/* Kolom Kanan: Rincian Estimasi Biaya & Tombol Checkout */}
          <TaxEstimateResult
            calculatedResult={calculatedResult}
            formData={formData}
            onProceedToCheckout={handleProceedToCheckout}
          />
        </div>
      </div>
    </section>
  );
}
