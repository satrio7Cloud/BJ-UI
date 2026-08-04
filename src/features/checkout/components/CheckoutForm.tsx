import { ArrowLeft, Car, FileText, Loader2, ShieldCheck, Truck, User } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createCustomer } from "../../../api/customer";
import { createCustomerVehicle } from "../../../api/customerVehicle";
import { createOrderApi, uploadCustomerDocument } from "../../../api/order";
import { type ApiService } from "../../../api/services";
import { getModels, type VehicleModel } from "../../../api/vehicle";

interface CheckoutFormProps {
    checkoutData: {
        service: ApiService;
        pkg: "reguler" | "express";
        price: number;
    };
    onBack: () => void;
}

export default function CheckoutForm({ checkoutData, onBack }: CheckoutFormProps) {
    const [formData, setFormData] = useState({
        // Customer Data
        fullname: "",
        email: "",
        phone_number: "",
        address: "",
        nik: "",
        // Vehicle Data
        model_id: "",
        plate_number: "",
        year: new Date().getFullYear().toString(),
        // Order Logistics Data
        pickup_method: "OJOL",
        pickup_address: "",
        return_method: "GRAB",
        is_name_transfer_required: false,
        notes: "",
        samsat_origin: "",
        samsat_destination: "",
    });

    const [models, setModels] = useState<VehicleModel[]>([]);
    const [documentFile, setDocumentFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [orderIdRef, setOrderIdRef] = useState<string | null>(null);

    useEffect(() => {
        const fetchModels = async () => {
            try {
                const response = await getModels();
                setModels(response.data);
            } catch (err) {
                console.error("Gagal memuat model kendaraan:", err);
            }
        };
        fetchModels();
    }, []);

    const adminFee = 25000;
    const serviceNameLower = checkoutData.service.service_name.toLowerCase();
    const categoryLower = checkoutData.service.category.toLowerCase();

    const isServiceInherentlyNameTransfer =
        categoryLower === "mutasi kendaraan" ||
        categoryLower === "balik nama";

    const isPhysicalCheckRequired =
        isServiceInherentlyNameTransfer ||
        serviceNameLower.includes("5 tahunan") ||
        serviceNameLower.includes("ganti plat") ||
        formData.is_name_transfer_required;

    const physicalCheckFee = isPhysicalCheckRequired ? 30000 : 0;
    const totalDisplayPrice = checkoutData.price + adminFee + physicalCheckFee;

    const handleSubmit = async () => {
        // Validasi Form Keseluruhan
        if (!formData.fullname.trim()) {
            toast.error("Nama lengkap tidak boleh kosong.",);
            return;
        }
        if (!/^[0-9]{10,14}$/.test(formData.phone_number)) {
            toast.error("Nomor WhatsApp tidak valid. Harus berupa 10-14 digit angka.",);
            return;
        }
        if (!/^\d{16}$/.test(formData.nik)) {
            toast.error("NIK harus terdiri dari 16 digit angka.",);
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            toast.error("Format email tidak valid.",);
            return;
        }
        if (!formData.address.trim()) {
            toast.error("Alamat lengkap tidak boleh kosong.",);
            return;
        }
        if (!formData.model_id) {
            toast.error("Silakan pilih model kendaraan terlebih dahulu.",);
            return;
        }
        if (!/^[A-Z]{1,2}\s[0-9]{1,4}\s[A-Z]{1,3}$/.test(formData.plate_number.trim())) {
            toast.error("Format Plat Nomor (Nopol) tidak valid. Harap gunakan format yang benar beserta spasi, contoh: B 1234 ABC", {});
            return;
        }
        const yearInt = parseInt(formData.year, 10);
        if (isNaN(yearInt) || yearInt < 1900 || yearInt > new Date().getFullYear()) {
            toast(`Tahun pembuatan tidak valid. Harap masukkan tahun antara 1900 dan ${new Date().getFullYear()}.`);
            return;
        }
        if (formData.pickup_method !== "SENDIRI" || formData.return_method !== "AMBIL_SENDIRI") {
            if (!formData.pickup_address.trim()) {
                toast("Alamat penjemputan/pengembalian tidak boleh kosong karena Anda memilih kurir/ojol.");
                return;
            }
        }

        if (isServiceInherentlyNameTransfer || formData.is_name_transfer_required) {
            if (!formData.samsat_origin.trim()) {
                toast.error("Samsat Asal tidak boleh kosong.");
                return;
            }
            if (!formData.samsat_destination.trim()) {
                toast.error("Samsat Tujuan tidak boleh kosong.");
                return;
            }
        }

        try {
            setIsSubmitting(true);

            // 1. Create Customer
            const customerRes = await createCustomer({
                fullname: formData.fullname,
                email: formData.email,
                phone_number: formData.phone_number,
                address: formData.address,
                nik: formData.nik,
            });
            const customerId = customerRes.data?.id;
            if (!customerId) throw new Error("Gagal mendapatkan ID Customer dari server");

            // 2. Create Vehicle
            const vehicleRes = await createCustomerVehicle({
                customer_id: customerId,
                model_id: formData.model_id,
                plate_number: formData.plate_number,
                year: parseInt(formData.year, 10),
            });
            const vehicleId = vehicleRes.data?.id;
            if (!vehicleId) throw new Error("Gagal mendapatkan ID Kendaraan dari server");

            // 3. Create Order
            const orderRes = await createOrderApi({
                customer_id: customerId,
                vehicle_id: vehicleId,
                service_id: checkoutData.service.id,
                pickup_method: formData.pickup_method,
                pickup_address: formData.pickup_address,
                customer_tracking_number: "",
                return_method: formData.return_method,
                tax_amount: 0,
                service_fee: checkoutData.service.service_fee,
                admin_fee: 0,
                physical_check_fee: 0,
                delivery_fee: 0,
                express_fee: checkoutData.pkg === "express" ? checkoutData.service.express_fee : 0,
                service_level: checkoutData.pkg.toUpperCase(),
                is_name_transfer_required: formData.is_name_transfer_required || isServiceInherentlyNameTransfer,
                samsat_origin: (isServiceInherentlyNameTransfer || formData.is_name_transfer_required) ? formData.samsat_origin : undefined,
                samsat_destination: (isServiceInherentlyNameTransfer || formData.is_name_transfer_required) ? formData.samsat_destination : undefined,
                notes: formData.notes,
            });
            const orderId = orderRes.data?.id;
            if (!orderId) throw new Error("Gagal membuat pesanan");

            // 4. Upload Document
            if (documentFile) {
                await uploadCustomerDocument(orderId, "STNK", documentFile);
            }

            // 5. Show Success Screen
            setOrderIdRef(orderId);
            setIsSuccess(true);
            window.scrollTo(0, 0);

        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Terjadi kesalahan saat memproses pesanan.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-sm max-w-2xl mx-auto text-center space-y-6">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-800">Pesanan Berhasil Dibuats!</h2>

                <p className="text-slate-600 text-lg leading-relaxed">
                    Terima kasih telah mempercayakan pengurusan surat kendaraan Anda kepada DTerazz Biro Jasa.
                </p>

                <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl text-left space-y-3">
                    <h3 className="font-bold text-amber-900 text-lg">Langkah Selanjutnya:</h3>
                    <ul className="list-disc pl-5 text-amber-800 space-y-2 text-sm">
                        <li>Admin kami akan melakukan pengecekan dan verifikasi dokumen yang Anda lampirkan.</li>
                        <li>Jika dokumen sudah lengkap dan sesuai, Admin akan membuatkan tagihan pembayaran (Invoice).</li>
                        <li>Anda akan menerima pesan <b>WhatsApp</b> yang berisi Link Pembayaran resmi.</li>
                    </ul>
                </div>

                {(formData.pickup_method === "OJOL" || formData.pickup_method === "GOSEND" || formData.pickup_method === "KURIR") && (
                    <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl text-left space-y-3 mt-4">
                        <h3 className="font-bold text-blue-900 text-lg flex items-center gap-2">
                            <Truck className="w-5 h-5" />
                            Khusus Penjemputan via Kurir / Ojol
                        </h3>
                        <p className="text-blue-800 text-sm">
                            Karena Anda memilih metode penjemputan berkas via GoSend/GrabExpress/Kurir Eksternal, <b>mohon segera pesan kurir Anda</b> ke alamat kantor kami.
                        </p>
                        <p className="text-blue-800 text-sm">
                            Setelah kurir dipesan, <b>kirimkan Link Live Tracking atau Nomor Resi</b> ke WhatsApp Admin kami agar kami bisa melacak kedatangan berkas Anda.
                        </p>
                        <a
                            href={`https://wa.me/6285156419062?text=${encodeURIComponent(`Halo Admin, ini link tracking/resi untuk penjemputan berkas pesanan saya (ID: ${orderIdRef}).\nLink/Resi: `)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg text-sm hover:bg-blue-700 transition-colors"
                        >
                            Kirim Resi ke WhatsApp Admin
                        </a>
                    </div>
                )}

                <div className="text-xs text-slate-500 font-mono mt-4">
                    ID Pesanan: {orderIdRef}
                </div>

                <button
                    onClick={() => {
                        setIsSuccess(false);
                        onBack();
                    }}
                    className="mt-8 px-8 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors w-full sm:w-auto"
                >
                    Selesai & Kembali ke Layanan
                </button>
            </div>
        );
    }

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-2 space-y-6">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-emerald-600 transition-colors mb-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke Daftar Layananx
                </button>

                {isServiceInherentlyNameTransfer && (
                    <div className="bg-amber-50/80 border border-amber-200 rounded-3xl p-6 space-y-4">
                        <h3 className="text-base font-bold text-amber-900 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-amber-600" />
                            Informasi & Syarat Layanan
                        </h3>
                        <p className="text-sm text-amber-800 leading-relaxed">
                            {checkoutData.service.service_name.toLowerCase().includes("mutasi")
                                ? "Mutasi motor/kendaraan adalah proses memindahkan data surat kendaraan (STNK dan BPKB) dari satu wilayah Samsat asal ke wilayah Samsat tujuan yang baru. Syarat utamanya meliputi BPKB asli dan fotokopi, STNK asli, KTP pemilik baru, serta kuitansi jual beli bermeterai."
                                : "Balik nama kendaraan adalah proses pengalihan kepemilikan kendaraan bermotor dari pemilik pertama ke pemilik kedua dan seterusnya. Syarat utamanya meliputi BPKB asli dan fotokopi, STNK asli, KTP pemilik baru, serta kuitansi jual beli bermeterai."
                            }
                        </p>
                        <div className="border-t border-amber-200 pt-3">
                            <p className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">Syarat Dokumen Fisik:</p>
                            <ul className="list-disc list-inside text-sm text-amber-800 space-y-1">
                                <li>STNK asli beserta fotokopi</li>
                                <li>BPKB asli beserta fotokopi</li>
                                <li>KTP asli pemilik baru sesuai alamat tujuan</li>
                            </ul>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <User className="w-5 h-5 text-emerald-600" />
                        Masukan Data Diri Anda
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Nama Lengkap</label>
                            <input
                                type="text"
                                placeholder="Sesuai KTP"
                                value={formData.fullname}
                                onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Nomor WhatsApp</label>
                            <input
                                type="number"
                                placeholder="Contoh: 08123456789"
                                value={formData.phone_number}
                                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Nomor Induk Kependudukan (NIK)</label>
                            <input
                                type="text"
                                placeholder="16 Digit NIK KTP"
                                value={formData.nik}
                                onChange={(e) => {
                                    // Hanya angka dan maksimal 16 digit
                                    const value = e.target.value.replace(/\D/g, "").slice(0, 16);

                                    setFormData({
                                        ...formData,
                                        nik: value,
                                    });
                                }}
                                maxLength={16}
                                inputMode="numeric"
                                pattern="[0-9]*"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                            <input
                                type="email"
                                placeholder="Contoh: budi@email.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Alamat Lengkap</label>
                            <textarea
                                placeholder="Sesuai KTP / Domisili saat ini"
                                rows={2}
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Car className="w-5 h-5 text-emerald-600" />
                        Data Kendaraan Anda
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-6">
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Pilih Model Kendaraan</label>
                            <select
                                value={formData.model_id}
                                onChange={(e) => setFormData({ ...formData, model_id: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white"
                            >
                                <option value="">-- Pilih Model Kendaraan --</option>
                                {models.map(model => (
                                    <option key={model.id} value={model.id}>
                                        {model.model_name} ({model.vehicle_type === 'mobil' ? 'Mobil' : 'Motor'})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Plat Nomor (Nopol)</label>
                            <input
                                type="text"
                                placeholder="Contoh: B 1234 ABC"
                                value={formData.plate_number}
                                onChange={(e) => {
                                    const value = e.target.value
                                        .toUpperCase()
                                        .replace(/[^A-Z0-9 ]/g, "");

                                    setFormData({
                                        ...formData,
                                        plate_number: value,
                                    });
                                }}
                                maxLength={10}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Tahun Pembuatan</label>
                            <input
                                type="number"
                                placeholder="Contoh: 2018"
                                value={formData.year}
                                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Truck className="w-5 h-5 text-emerald-600" />
                        Pengiriman & Catatan
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Metode Penjemputan Berkas</label>
                            <select
                                value={formData.pickup_method}
                                onChange={(e) => setFormData({ ...formData, pickup_method: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white"
                            >
                                <option value="OJOL">Ojek Online (GoSend/GrabExpress)</option>
                                <option value="SENDIRI">Antar Sendiri ke Kantor</option>
                                <option value="KURIR">Kurir Internal</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Metode Pengembalian Berkas</label>
                            <select
                                value={formData.return_method}
                                onChange={(e) => setFormData({ ...formData, return_method: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white"
                            >
                                <option value="GRAB">GrabExpress / GoSend</option>
                                <option value="AMBIL_SENDIRI">Ambil Sendiri di Kantor</option>
                                <option value="KURIR">Kurir Internal</option>
                            </select>
                        </div>
                        {!(formData.pickup_method === "SENDIRI" && formData.return_method === "AMBIL_SENDIRI") && (
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    {formData.pickup_method !== "SENDIRI" && formData.return_method !== "AMBIL_SENDIRI"
                                        ? "Alamat Penjemputan & Pengembalian"
                                        : formData.pickup_method !== "SENDIRI"
                                            ? "Alamat Penjemputan Berkas"
                                            : "Alamat Pengembalian Berkas"
                                    }
                                </label>
                                <textarea
                                    placeholder="Detail alamat lengkap Anda..."
                                    rows={2}
                                    value={formData.pickup_address}
                                    onChange={(e) => setFormData({ ...formData, pickup_address: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white"
                                />
                            </div>
                        )}
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Catatan Tambahan (Opsional)</label>
                            <textarea
                                placeholder="Contoh: Tolong diproses cepat ya mas..."
                                rows={2}
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white"
                            />
                        </div>
                        <div className="sm:col-span-2 flex items-center gap-3 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                            <input
                                type="checkbox"
                                id="nameTransfer"
                                checked={formData.is_name_transfer_required || isServiceInherentlyNameTransfer}
                                disabled={isServiceInherentlyNameTransfer}
                                onChange={(e) => setFormData({ ...formData, is_name_transfer_required: e.target.checked })}
                                className="w-5 h-5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 disabled:opacity-50"
                            />
                            <label htmlFor="nameTransfer" className={`text-sm font-semibold text-emerald-900 cursor-pointer ${isServiceInherentlyNameTransfer ? "opacity-50" : ""}`}>
                                Perlu Mutasi / Balik Nama Kendaraan {isServiceInherentlyNameTransfer && "(Sudah Termasuk)"}
                            </label>
                        </div>
                        {(isServiceInherentlyNameTransfer || formData.is_name_transfer_required) && (
                            <div className="sm:col-span-2 grid sm:grid-cols-2 gap-4 mt-1 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Samsat Asal (Kota Asal Kendaraan)</label>
                                    <input
                                        type="text"
                                        placeholder="Contoh: SAMSAT Jakarta Timur"
                                        value={formData.samsat_origin}
                                        onChange={(e) => setFormData({ ...formData, samsat_origin: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Samsat Tujuan (Mutasi Ke)</label>
                                    <input
                                        type="text"
                                        placeholder="Contoh: SAMSAT Bandung Barat"
                                        value={formData.samsat_destination}
                                        onChange={(e) => setFormData({ ...formData, samsat_destination: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-sm"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-emerald-600" />
                        Upload Dokumen Pendukung
                    </h2>
                    <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:bg-slate-100 transition-colors">
                        <input
                            type="file"
                            id="fileUpload"
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files && e.target.files.length > 0) {
                                    setDocumentFile(e.target.files[0]);
                                }
                            }}
                        />
                        <label htmlFor="fileUpload" className="cursor-pointer flex flex-col items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-700">
                                    {documentFile ? documentFile.name : "Pilih File Dokumen (STNK/KTP)"}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                    {documentFile ? "Klik untuk mengganti file" : "Upload foto atau scan berkas fisik Anda (Maks. 5MB)"}
                                </p>
                            </div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Right Column - Summary */}
            <div className="lg:col-span-1">
                <div className="bg-slate-900 rounded-3xl p-6 shadow-xl sticky top-24 text-white">
                    <h3 className="text-lg font-bold mb-4 border-b border-slate-700 pb-4">Ringkasan Pesanan Anda</h3>

                    <div className="space-y-4 mb-6">
                        <div>
                            <p className="text-slate-400 text-sm mb-1">Layanan</p>
                            <p className="font-semibold text-lg">{checkoutData.service.service_name}</p>
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm mb-1">Paket Pilihan</p>
                            <div className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                <ShieldCheck className="w-3 h-3" />
                                {checkoutData.pkg}
                            </div>
                        </div>
                        <div className="pt-4 border-t border-slate-700 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Biaya Layanan</span>
                                <span className="font-semibold">Rp {checkoutData.price.toLocaleString("id-ID")}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Biaya Admin</span>
                                <span className="font-semibold">Rp {adminFee.toLocaleString("id-ID")}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Biaya Cek Fisik</span>
                                <span className={`font-semibold ${physicalCheckFee > 0 ? "text-emerald-400" : ""}`}>
                                    Rp {physicalCheckFee.toLocaleString("id-ID")}
                                </span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-700">
                            <p className="text-slate-400 text-sm mb-1">Total Biaya</p>
                            <p className="text-3xl font-extrabold text-emerald-400">
                                Rp {totalDisplayPrice.toLocaleString("id-ID")}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-400 disabled:cursor-not-allowed text-white font-bold transition-colors shadow-lg hover:shadow-emerald-500/30 text-lg flex items-center justify-center gap-2 cursor-pointer"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin" />
                                Memproses...
                            </>
                        ) : (
                            "Pilih Metode Pembayaran"
                        )}
                    </button>
                    <p className="text-center text-xs text-slate-400 mt-4">
                        Data Anda aman dan dienkripsi dengan standar keamanan tinggi.
                    </p>
                </div>
            </div>
        </div>
    );
}
