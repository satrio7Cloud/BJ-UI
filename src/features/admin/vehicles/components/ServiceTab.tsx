import {
  Check,
  Edit2,
  List,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  createService,
  deleteService,
  getServices,
  updateService,
  type ApiService,
} from "../../../../api/services";
import Button from "../../../../shared/components/Button";

export default function ServiceTab() {
  const [services, setServices] = useState<ApiService[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [serviceName, setServiceName] = useState("");
  const [serviceCategory, setServiceCategory] = useState("");
  const [serviceFee, setServiceFee] = useState("");
  const [serviceExpressFee, setServiceExpressFee] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [isSubmittingService, setIsSubmittingService] = useState(false);
  const [serviceSearchQuery, setServiceSearchQuery] = useState("");
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  const fetchServicesData = async () => {
    try {
      setIsLoadingServices(true);
      const res = await getServices();
      if (res?.data) {
        setServices(res.data);
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal mengambil data layanan");
    } finally {
      setIsLoadingServices(false);
    }
  };

  useEffect(() => {
    fetchServicesData();
  }, []);

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName.trim()) {
      toast.error("Nama layanan tidak boleh kosong");
      return;
    }
    if (!serviceCategory.trim()) {
      toast.error("Kategori layanan tidak boleh kosong");
      return;
    }
    if (!serviceFee.trim() || isNaN(Number(serviceFee))) {
      toast.error("Biaya layanan reguler harus berupa angka");
      return;
    }
    if (!serviceExpressFee.trim() || isNaN(Number(serviceExpressFee))) {
      toast.error("Biaya layanan express harus berupa angka");
      return;
    }

    try {
      setIsSubmittingService(true);
      const payload = {
        service_name: serviceName.trim(),
        category: serviceCategory.trim(),
        service_fee: Number(serviceFee),
        express_fee: Number(serviceExpressFee),
        description: serviceDescription.trim(),
      };

      if (editingServiceId) {
        const res = await updateService(editingServiceId, payload);
        toast.success(res.message || "Layanan berhasil diperbarui!");
      } else {
        const res = await createService(payload);
        toast.success(res.message || "Layanan berhasil ditambahkan!");
      }

      setServiceName("");
      setServiceCategory("");
      setServiceFee("");
      setServiceExpressFee("");
      setServiceDescription("");
      setEditingServiceId(null);
      fetchServicesData(); // Refresh list
    } catch (err: any) {
      toast.error(
        err.message ||
          (editingServiceId
            ? "Gagal memperbarui layanan"
            : "Gagal menambahkan layanan"),
      );
    } finally {
      setIsSubmittingService(false);
    }
  };

  const handleEditService = (service: ApiService) => {
    setEditingServiceId(service.id);
    setServiceName(service.service_name);
    setServiceCategory(service.category);
    setServiceFee(service.service_fee.toString());
    setServiceExpressFee(service.express_fee.toString());
    setServiceDescription(service.description);
    // Scroll to form smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteService = async (id: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus layanan ini?")) {
      return;
    }
    try {
      const res = await deleteService(id);
      toast.success(res.message || "Layanan berhasil dihapus");
      fetchServicesData();
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus layanan");
    }
  };

  const filteredServices = services.filter(
    (service) =>
      service.service_name
        .toLowerCase()
        .includes(serviceSearchQuery.toLowerCase()) ||
      service.category.toLowerCase().includes(serviceSearchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-10">
      {/* Form Add Service */}
      <div className="space-y-4 bg-slate-50/50 dark:bg-slate-800/20 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/60">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
            {editingServiceId ? "Ubah Layanan" : "Tambah Layanan Baru"}
          </h2>
          {editingServiceId && (
            <button
              type="button"
              onClick={() => {
                setEditingServiceId(null);
                setServiceName("");
                setServiceCategory("");
                setServiceFee("");
                setServiceExpressFee("");
                setServiceDescription("");
              }}
              className="text-xs text-red-500 hover:text-red-700 font-semibold"
            >
              Batal Ubah
            </button>
          )}
        </div>
        <form
          onSubmit={handleSaveService}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Nama Layanan
            </label>
            <input
              type="text"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              placeholder="Contoh: Perpanjang STNK 5 Tahun"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Kategori Layanan
            </label>
            <input
              type="text"
              value={serviceCategory}
              onChange={(e) => setServiceCategory(e.target.value)}
              placeholder="Contoh: STNK, BPKB, SIM, Plat Nomor, dll."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Biaya Jasa Dasar / Reguler (Rupiah)
            </label>
            <input
              type="text"
              value={serviceFee}
              onChange={(e) => setServiceFee(e.target.value)}
              placeholder="Contoh: 300000"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Biaya Tambahan Express (Rupiah)
            </label>
            <input
              type="text"
              value={serviceExpressFee}
              onChange={(e) => setServiceExpressFee(e.target.value)}
              placeholder="Contoh: 150000"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Deskripsi Layanan
            </label>
            <textarea
              value={serviceDescription}
              onChange={(e) => setServiceDescription(e.target.value)}
              placeholder="Contoh: Kebutuhan perpanjangan STNK motor/mobil"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
              rows={3}
            />
          </div>

          <div className="md:col-span-2 pt-2">
            <Button
              type="submit"
              variant="primary"
              size="full"
              isLoading={isSubmittingService}
              className="py-3 shadow-sm hover:shadow-md"
            >
              {editingServiceId ? <Check size={16} /> : <Plus size={16} />}
              {editingServiceId ? "Simpan Perubahan" : "Tambah Layanan"}
            </Button>
          </div>
        </form>
      </div>

      {/* List Services Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white flex items-center gap-2">
              <List size={18} />
              Daftar Layanan Tersedia
            </h2>
            <span className="text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
              {filteredServices.length} layanan
            </span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={14} className="text-slate-400" />
              </div>
              <input
                type="text"
                value={serviceSearchQuery}
                onChange={(e) => setServiceSearchQuery(e.target.value)}
                placeholder="Cari layanan..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm shadow-sm"
              />
            </div>
            <button
              onClick={() => {
                fetchServicesData();
                toast.success("Data layanan berhasil disegarkan");
              }}
              title="Segarkan Layanan"
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors shadow-sm shrink-0 cursor-pointer"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {isLoadingServices ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            Belum ada layanan terdaftar.
          </div>
        ) : (
          <div className="relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-xs rounded-2xl">
            <div className="overflow-x-auto max-h-150 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
              <table className="w-full text-sm text-left text-slate-600 dark:text-slate-400 border-collapse">
                <thead className="text-xs text-slate-500 uppercase sticky top-0 z-10 bg-slate-50/90 dark:bg-slate-800/90 backdrop-blur-md shadow-xs">
                  <tr>
                    <th className="px-6 py-4 font-bold tracking-wider">No.</th>
                    <th className="px-6 py-4 font-bold tracking-wider">
                      Informasi Layanan
                    </th>
                    <th className="px-6 py-4 font-bold tracking-wider">
                      Kategori
                    </th>
                    <th className="px-6 py-4 font-bold tracking-wider text-right">
                      Biaya Reguler
                    </th>
                    <th className="px-6 py-4 font-bold tracking-wider text-right">
                      Biaya Express
                    </th>
                    <th className="px-6 py-4 font-bold tracking-wider text-center">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {filteredServices.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-12 text-center text-slate-400"
                      >
                        Layanan tidak ditemukan.
                      </td>
                    </tr>
                  ) : (
                    filteredServices.map((service, idx) => {
                      // Dynamic badge color based on category text
                      let badgeStyle =
                        "bg-indigo-50 text-indigo-700 ring-indigo-600/20 dark:bg-indigo-500/10 dark:text-indigo-400 dark:ring-indigo-500/20";
                      const cat = (service.category || "").toLowerCase();
                      if (cat.includes("pajak")) {
                        badgeStyle =
                          "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20";
                      } else if (cat.includes("mutasi")) {
                        badgeStyle =
                          "bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/20";
                      } else if (cat.includes("balik nama")) {
                        badgeStyle =
                          "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20";
                      } else if (cat.includes("payment")) {
                        badgeStyle =
                          "bg-purple-50 text-purple-700 ring-purple-600/20 dark:bg-purple-500/10 dark:text-purple-400 dark:ring-purple-500/20";
                      }

                      return (
                        <tr
                          key={service.id}
                          className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all duration-200"
                        >
                          <td className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
                            {(idx + 1).toString().padStart(2, "0")}
                          </td>
                          <td className="px-6 py-4 max-w-70">
                            <p className="font-bold text-slate-900 dark:text-white truncate transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                              {service.service_name}
                            </p>
                            <p
                              className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-1 leading-relaxed"
                              title={service.description}
                            >
                              {service.description || "Tidak ada deskripsi."}
                            </p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ring-1 ring-inset ${badgeStyle}`}
                            >
                              {service.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <span className="font-bold text-slate-700 dark:text-slate-200">
                              Rp{" "}
                              {(service.service_fee || 0).toLocaleString(
                                "id-ID",
                              )}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <span className="font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2.5 py-1 rounded-md">
                              Rp{" "}
                              {(service.express_fee || 0).toLocaleString(
                                "id-ID",
                              )}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleEditService(service)}
                                title="Ubah"
                                className="p-1.5 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteService(service.id)
                                }
                                title="Hapus"
                                className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
