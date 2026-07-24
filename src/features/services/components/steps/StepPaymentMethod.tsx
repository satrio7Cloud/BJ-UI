import { useState } from "react";
import { ArrowLeft, QrCode, Building2, Smartphone, Wallet, Check } from "lucide-react";
import Button from "../../../../shared/components/Button";
import { Input } from "../../../../shared/components/Input";
import toast from "react-hot-toast";
import Stepper from "../Stepper";

interface Props {
  price: number;
  onBack: () => void;
  onNext: (method: string, detail: any) => void;
}

export default function StepPaymentMethod({ price, onBack, onNext }: Props) {
  const [selectedMethod, setSelectedMethod] = useState<string>("qris");
  
  // Specific method details state
  const [selectedBank, setSelectedBank] = useState<string>("BCA");
  const [selectedWallet, setSelectedWallet] = useState<string>("GoPay");
  const [walletPhone, setWalletPhone] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedMethod === "qris") {
      onNext("qris", { name: "QRIS" });
    } else if (selectedMethod === "bank") {
      onNext("bank", { name: selectedBank });
    } else if (selectedMethod === "ewallet") {
      if (!walletPhone.trim()) {
        toast.error("Nomor handphone untuk e-wallet wajib diisi");
        return;
      }
      onNext("ewallet", { name: selectedWallet, phone: walletPhone });
    }
  };

  const bankOptions = [
    { id: "BCA", label: "BCA Virtual Account", logo: "🏦" },
    { id: "MANDIRI", label: "Mandiri Virtual Account", logo: "🏦" },
    { id: "BNI", label: "BNI Virtual Account", logo: "🏦" },
    { id: "BRI", label: "BRI Virtual Account", logo: "🏦" },
  ];

  const walletOptions = [
    { id: "GoPay", label: "GoPay", desc: "Push notification aplikasi Gojek" },
    { id: "OVO", label: "OVO", desc: "Push notification aplikasi OVO" },
    { id: "DANA", label: "DANA", desc: "Konfirmasi di aplikasi DANA" },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col h-[90vh] max-w-3xl w-full bg-white rounded-2xl"
    >
      {/* HEADER */}
      <div className="flex items-center gap-3 p-5 border-b">
        <ArrowLeft onClick={onBack} className="cursor-pointer text-gray-600 hover:text-gray-900" />
        <div>
          <h2 className="text-lg font-semibold">Pilih Metode Pembayaran</h2>
          <p className="text-sm text-gray-500">Jumlah tagihan: Rp {price.toLocaleString("id-ID")}</p>
        </div>
      </div>

      <Stepper currentStep={4} />

      {/* BODY */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        
        {/* BILLING SUMMARY WIDGET */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            <Wallet className="text-blue-600" size={18} />
            <span className="font-medium text-blue-900">Total Tagihan Pemesanan</span>
          </div>
          <span className="text-base font-bold text-blue-700">Rp {price.toLocaleString("id-ID")}</span>
        </div>

        <h3 className="font-semibold text-gray-900 text-sm">Pilih Kategori Pembayaran</h3>

        {/* PAYMENT CATEGORIES */}
        <div className="space-y-3">
          
          {/* OPTION 1: QRIS */}
          <div
            onClick={() => setSelectedMethod("qris")}
            className={`border rounded-xl p-4 cursor-pointer transition flex items-start gap-4 ${
              selectedMethod === "qris" ? "border-blue-600 bg-blue-50/20" : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className={`p-2.5 rounded-lg border ${selectedMethod === "qris" ? "border-blue-300 bg-blue-50" : "border-gray-200 bg-gray-50"}`}>
              <QrCode className="text-blue-600" size={20} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-gray-950 text-sm">QRIS (GoPay/OVO/Dana/LinkAja/ShopeePay)</h4>
                {selectedMethod === "qris" && <Check className="text-blue-600" size={16} />}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Scan kode QR menggunakan aplikasi e-wallet atau m-banking apa saja. Instan dan otomatis terverifikasi.
              </p>
            </div>
          </div>

          {/* OPTION 2: VIRTUAL ACCOUNT */}
          <div
            onClick={() => setSelectedMethod("bank")}
            className={`border rounded-xl p-4 cursor-pointer transition flex flex-col gap-3 ${
              selectedMethod === "bank" ? "border-blue-600 bg-blue-50/20" : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-2.5 rounded-lg border ${selectedMethod === "bank" ? "border-blue-300 bg-blue-50" : "border-gray-200 bg-gray-50"}`}>
                <Building2 className="text-blue-600" size={20} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-gray-950 text-sm">Transfer Bank (Virtual Account)</h4>
                  {selectedMethod === "bank" && <Check className="text-blue-600" size={16} />}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Transfer melalui ATM, m-Banking, atau internet banking dengan Virtual Account.
                </p>
              </div>
            </div>

            {/* Bank Options Dropdown/Selector */}
            {selectedMethod === "bank" && (
              <div className="grid grid-cols-2 gap-2 mt-2 pl-14">
                {bankOptions.map((b) => (
                  <div
                    key={b.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBank(b.id);
                    }}
                    className={`border rounded-lg p-2.5 text-xs font-semibold text-center cursor-pointer transition ${
                      selectedBank === b.id
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <span className="mr-1">{b.logo}</span> {b.id}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* OPTION 3: E-WALLET */}
          <div
            onClick={() => setSelectedMethod("ewallet")}
            className={`border rounded-xl p-4 cursor-pointer transition flex flex-col gap-3 ${
              selectedMethod === "ewallet" ? "border-blue-600 bg-blue-50/20" : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-2.5 rounded-lg border ${selectedMethod === "ewallet" ? "border-blue-300 bg-blue-50" : "border-gray-200 bg-gray-50"}`}>
                <Smartphone className="text-blue-600" size={20} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-gray-950 text-sm">E-Wallet (GoPay / OVO / DANA)</h4>
                  {selectedMethod === "ewallet" && <Check className="text-blue-600" size={16} />}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Pembayaran langsung dengan otentikasi push notification ke aplikasi e-wallet Anda.
                </p>
              </div>
            </div>

            {/* E-wallet Options & Phone Input */}
            {selectedMethod === "ewallet" && (
              <div className="space-y-3 mt-2 pl-14">
                <div className="grid grid-cols-3 gap-2">
                  {walletOptions.map((w) => (
                    <div
                      key={w.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedWallet(w.id);
                      }}
                      className={`border rounded-lg p-2 text-center text-xs font-semibold cursor-pointer transition ${
                        selectedWallet === w.id
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      {w.id}
                    </div>
                  ))}
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">
                    Nomor HP Terdaftar {selectedWallet}
                  </label>
                  <Input
                    name="phone"
                    placeholder="Contoh: 08123456789"
                    value={walletPhone}
                    onChange={(e) => setWalletPhone(e.target.value)}
                    className="py-2 text-xs"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* FOOTER */}
      <div className="p-5 border-t">
        <Button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-xl"
        >
          Lanjutkan
        </Button>
      </div>
    </form>
  );
}
