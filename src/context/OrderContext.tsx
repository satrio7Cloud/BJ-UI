import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { documents as defaultDocuments } from "../data/document";
import { invoices as defaultInvoices } from "../data/invoices";
import type { Service } from "../data/services";
import toast from "react-hot-toast";

export interface DocumentStep {
  title: string;
  date: string | null;
  description: string;
  done: boolean;
  warning?: boolean;
}

export interface DocumentItem {
  id: string;
  title: string;
  status: string;
  category: string;
  progress: number;
  updatedAt: string;
  steps: DocumentStep[];
}

export interface InvoiceItem {
  id: string;
  date: string;
  customer: string;
  email: string;
  service: string;
  amount: number;
  status: string;
}

interface OrderContextProps {
  documents: DocumentItem[];
  invoices: InvoiceItem[];
  createOrder: (
    service: Service,
    option: Service["options"][0],
    formData: never,
    shippingFee: number,
    paymentMethod: string,
    paymentDetail: unknown,
  ) => { docId: string; invId: string };
}

const OrderContext = createContext<OrderContextProps | undefined>(undefined);

const formatDate = (date: Date) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Ags",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

const formatDateTime = (date: Date) => {
  const dateStr = formatDate(date);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${dateStr}, ${hours}:${minutes}`;
};

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedDocs = localStorage.getItem("bj_documents");
    const savedInvs = localStorage.getItem("bj_invoices");

    if (savedDocs) {
      setDocuments(JSON.parse(savedDocs));
    } else {
      setDocuments(defaultDocuments as DocumentItem[]);
      localStorage.setItem("bj_documents", JSON.stringify(defaultDocuments));
    }

    if (savedInvs) {
      setInvoices(JSON.parse(savedInvs));
    } else {
      setInvoices(defaultInvoices as InvoiceItem[]);
      localStorage.setItem("bj_invoices", JSON.stringify(defaultInvoices));
    }
  }, []);

  const createOrder = (
    service: Service,
    option: Service["options"][0],
    formData: any,
    shippingFee: number,
    _paymentMethod: string,
    _paymentDetail: any,
  ) => {
    const now = new Date();
    const dateStr = formatDate(now);
    const dateTimeStr = formatDateTime(now);

    // 1. Generate Order IDs
    const nextOrderNum = documents.length + 1;
    const formattedNum = nextOrderNum.toString().padStart(3, "0");
    const docId = `DOC-2026-${formattedNum}`;
    const invId = `INV-2026-00${formattedNum}`;

    // 2. Determine Document Title based on inputs
    let docTitle = `${service.title}`;
    if (formData.plateNumber) {
      docTitle += ` - B ${formData.plateNumber.toUpperCase()}`;
    }

    // 3. Set dynamic tracking steps based on Category
    let steps: DocumentStep[] = [];
    if (service.category === "STNK") {
      steps = [
        {
          title: "Pengajuan Diterima",
          date: dateStr,
          description:
            "Dokumen persyaratan telah lengkap dan terverifikasi di sistem",
          done: true,
        },
        {
          title: "Cek Fisik Kendaraan",
          date: null,
          description:
            "Menunggu antrean cek fisik nomor rangka & mesin di Samsat",
          done: false,
        },
        {
          title: "Proses Loket Samsat",
          date: null,
          description:
            "Penetapan pajak kendaraan & nominal PNBP di loket Samsat",
          done: false,
        },
        {
          title: "Pencetakan STNK & Plat Baru",
          date: null,
          description: "Pencetakan lembar STNK baru & plat nomor kaleng",
          done: false,
        },
        {
          title: "Selesai & Pengiriman",
          date: null,
          description: "Dokumen selesai dan siap diserahkan/dikirim kurir",
          done: false,
        },
      ];
    } else if (service.category === "BPKB") {
      steps = [
        {
          title: "Pengajuan Diterima",
          date: dateStr,
          description: "Berkas BPKB asli & syarat pendukung telah divalidasi",
          done: true,
        },
        {
          title: "Penerbitan STNK Baru",
          date: null,
          description: "Proses mutasi nama pada lembar STNK baru di Samsat",
          done: false,
        },
        {
          title: "Pendaftaran Berkas Polda",
          date: null,
          description:
            "Penyerahan berkas pendaftaran BPKB baru ke Ditlantas Polda",
          done: false,
        },
        {
          title: "Pencetakan BPKB Baru",
          date: null,
          description:
            "Proses pencetakan buku BPKB baru atas nama pemilik baru",
          done: false,
        },
        {
          title: "Selesai",
          date: null,
          description: "Buku BPKB baru siap diambil oleh pemilik",
          done: false,
        },
      ];
    } else if (service.category === "Mutasi") {
      steps = [
        {
          title: "Pengajuan Diterima",
          date: dateStr,
          description: "Pengajuan mutasi keluar daerah berhasil divalidasi",
          done: true,
        },
        {
          title: "Verifikasi Berkas Polda",
          date: null,
          description: "Pemeriksaan berkas asal kendaraan di unit BPKB Polda",
          done: false,
        },
        {
          title: "Cabut Berkas Polda",
          date: null,
          description: "Proses penarikan berkas arsip induk fisik di Polda",
          done: false,
        },
        {
          title: "Pencetakan Surat Fiskal",
          date: null,
          description: "Penerbitan surat keterangan fiskal antar daerah",
          done: false,
        },
        {
          title: "Selesai",
          date: null,
          description: "Berkas mutasi siap didaftarkan di Samsat kota tujuan",
          done: false,
        },
      ];
    } else if (service.category === "SIM") {
      steps = [
        {
          title: "Pengajuan Diterima",
          date: dateStr,
          description: "Formulir pendaftaran & dokumen pemohon divalidasi",
          done: true,
        },
        {
          title: "Verifikasi & Sidik Jari",
          date: null,
          description: "Penjadwalan sidik jari, foto, & tanda tangan di Satpas",
          done: false,
        },
        {
          title: "Ujian Teori & Praktik",
          date: null,
          description: "Pelaksanaan ujian kompetensi berkendara",
          done: false,
        },
        {
          title: "Pencetakan Kartu SIM",
          date: null,
          description: "Proses pencetakan kartu SIM fisik baru",
          done: false,
        },
        {
          title: "Selesai",
          date: null,
          description: "Kartu SIM siap diserahkan kepada pemohon",
          done: false,
        },
      ];
    } else {
      // Plat Nomor
      steps = [
        {
          title: "Pengajuan Diterima",
          date: dateStr,
          description:
            "Rincian kombinasi angka & huruf pilihan telah didaftarkan",
          done: true,
        },
        {
          title: "Cek Ketersediaan Polda",
          date: null,
          description:
            "Pemeriksaan ketersediaan nomor pilihan di server Polda Metro",
          done: false,
        },
        {
          title: "Pembayaran PNBP Resmi",
          date: null,
          description: "Menunggu validasi pembayaran PNBP nomor cantik pilihan",
          done: false,
        },
        {
          title: "Penerbitan Surat Keputusan",
          date: null,
          description: "Proses penerbitan surat ketetapan alokasi nomor cantik",
          done: false,
        },
        {
          title: "Selesai",
          date: null,
          description: "Plat nomor fisik & STNK cantik siap diserahkan",
          done: false,
        },
      ];
    }

    // New Document Tracking Item
    const newDoc: DocumentItem = {
      id: docId,
      title: docTitle,
      status: "Diproses",
      category: service.category,
      progress: 20,
      updatedAt: dateTimeStr,
      steps,
    };

    // New Invoice Billing Item
    const servicePrice = service.basePrice + option.extraPrice;
    const finalAmount = servicePrice + shippingFee;

    const newInv: InvoiceItem = {
      id: invId,
      date: dateStr,
      customer: formData.name,
      email: `${formData.name.toLowerCase().replace(/\s+/g, "")}@example.com`,
      service: `${service.title} (${option.label})`,
      amount: finalAmount,
      status: "lunas", // paid via simulated gateway
    };

    // Update state and localStorage
    const updatedDocs = [newDoc, ...documents];
    const updatedInvs = [newInv, ...invoices];

    setDocuments(updatedDocs);
    setInvoices(updatedInvs);

    localStorage.setItem("bj_documents", JSON.stringify(updatedDocs));
    localStorage.setItem("bj_invoices", JSON.stringify(updatedInvs));

    toast.success(`Pesanan #${docId} berhasil tercatat di sistem.`);

    return { docId, invId };
  };

  return (
    <OrderContext.Provider value={{ documents, invoices, createOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};
