import { useState, type JSX } from "react";

export type Method = "kurir" | "datang" | "ojol";

export type ShippingMethod = {
  id: Method;
  title: string;
  subtitle: string;
};

export const shippingMethods: ShippingMethod[] = [
  {
    id: "kurir",
    title: "Jemput Kurir Kami",
    subtitle: "Dalam 1 – 2 jam",
  },
  {
    id: "datang",
    title: "Datang Langsung",
    subtitle: "Senin - Sabtu 08:00 - 17:00",
  },
  {
    id: "ojol",
    title: "Kirim via Ojol",
    subtitle: "Gojek / Grab / Maxim",
  },
];

export const shippingDetails: Record<Method, JSX.Element> = {
  kurir: (
    <>
      🚚 <b>Jemput Kurir Kami</b>
      <p className="mt-2">
        Tim kurir kami akan menjemput berkas ke lokasi Anda dan mengantarkan
        kembali setelah selesai.
      </p>
      <p className="mt-2 text-gray-600">⏱ Dalam 1 – 2 jam</p>
      <p className="mt-3 text-orange-700 font-medium">
        📌 Dikenakan ongkos (PP) sesuai jarak
      </p>
      <div className="mt-4">
        <b>⛽ Ongkos (PP)</b>
        <p className="mt-2">
          Layanan jemput kurir dikenakan ongkos (PP) yang dihitung berdasarkan
          jarak dari kantor kami ke lokasi Anda (PP - pulang pergi).
        </p>
      </div>
      <div className="mt-3">
        <b>📍 Kantor kami:</b>
        <p className="mt-1">Jl. Hasan Saban, Depok RT.03/09 No. 04</p>
      </div>
      <p className="mt-3 text-sm text-gray-500">
        * Biaya bensin akan diinformasikan via WhatsApp sebelum penjemputan.
      </p>
    </>
  ),

  datang: (
    <>
      📍 <b>Datang Langsung</b>
      <p className="mt-2">
        Kunjungi kantor kami secara langsung untuk menyerahkan berkas.
      </p>
      <div className="mt-3">
        <b>📍 Alamat Kantor</b>
        <p className="mt-1 font-medium">
          Jl. Hasan Saban, Depok RT.03/09 No. 04, dekat mushala Al-Ikhwan
        </p>
      </div>
      <p className="mt-3 text-gray-600">📌 Senin - Sabtu, 08:00 - 17:00</p>
      <p className="mt-3 text-sm text-gray-500">
        * Mohon konfirmasi terlebih dahulu via WhatsApp sebelum datang agar kami
        dapat menyiapkan administrasi Anda.
      </p>
    </>
  ),

  ojol: (
    <>
      🏍️ <b>Kirim via Ojol</b>
      <p className="mt-2">
        Gunakan layanan ojek online untuk mengirim berkas ke kantor kami.
      </p>
      <p className="mt-3 text-gray-600">📌 Gojek / Grab / Maxim</p>
      <div className="mt-4">
        <b>📍 Alamat Tujuan</b>
        <p className="mt-1">
          Jl. Hasan Saban, Depok RT.03/09 No. 04, dekat mushala Al-Ikhwan
        </p>
      </div>
      <div className="mt-3">
        <b>📝 Catatan untuk Driver</b>
        <p className="mt-1">Untuk Birosaja - Atas nama [Nama Anda]</p>
      </div>
      <p className="mt-3 text-sm text-gray-500">
        * Pastikan paket berisi fotokopi dokumen yang diperlukan dan tuliskan
        nomor WhatsApp Anda di dalam paket.
      </p>
    </>
  ),
};

export const useShipping = () => {
  const [method, setMethod] = useState<Method>("kurir");

  return {
    method,
    setMethod,
    shippingMethods,
    shippingDetails,
  };
};
