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
      🚚 <b>Jemput oleh Kurir Kami</b>
      <p className="mt-2">
        Tim kurir kami akan menghubungi Anda untuk konfirmasi waktu dan alamat
        penjemputan.
      </p>
    </>
  ),

  datang: (
    <>
      📍 <b>Alamat Kantor Kami</b>
      <p className="mt-2">
        Jl. Hasan Saban Depok No. 04, RT.003/RW.009
        <section className="text-gray-500">Dekat mushalla Al-Ikhwan</section>
        <br />
        Depok, 16435
      </p>
      <p className="mt-2">Senin - Sabtu, 08:00 - 17:00 WIB</p>
    </>
  ),

  ojol: (
    <>
      🏍️ <b>Cara Kirim via Ojol</b>
      <ol className="list-decimal ml-5 mt-2 space-y-1">
        <li>Buka aplikasi Gojek / Grab / Maxim</li>
        <li>Pilih layanan Instant / Same Day</li>
        <li>
          Masukkan alamat:
          <br />
          <b>Jl. Hasan Saban Depok No. 04, RT.003/RW.009</b>
          <section className="text-gray-500">Dekat mushalla Al-Ikhwan</section>
        </li>
        <li>
          Tambahkan catatan:
          <br />
          <b>Untuk Birosaja - Atas nama [Nama Anda]</b>
        </li>
      </ol>
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
