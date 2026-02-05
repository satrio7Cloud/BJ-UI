export const services = [
  {
    title: "Perpanjangan STNK",
    description: "Urus STNK tahunan tanpa antre.",
    price: "Mulai dari Rp350.000",
  },
  {
    title: "Balik Nama Kendaraan",
    description: "Proses cepat & legal.",
    price: "Mulai dari Rp1.500.000",
  },
];

export interface Service {
  id: string;
  title: string;
  description?: string;
  duration?: string;
  basePrice: number;
  category: ServiceCategory;
  options: ServiceOption[];
  note?: string;
}

export type ServiceOption = {
  type: "regular" | "express";
  label: string;
  duration: string;
  extraPrice: number;
}

export type ServiceCategory =
  | "Semua"
  | "STNK"
  | "BPKB"
  | "SIM"
  | "Plat Nomor"
  | "Mutasi";

export const servicesprice: Service[] = [
  // ================= STNK =================

  {
  id: "stnk-hilang-motor",
  title: "STNK Hilang / Rusak (Motor)",
  description: "Pengurusan STNK motor hilang atau rusak termasuk surat kehilangan & cek fisik kendaraan",
  category: "STNK",
  basePrice: 400000,
  options: [
    {
      type: "regular",
      label: "Reguler",
      duration: "5–7 Hari Kerja",
      extraPrice: 0,
    },
    {
      type: "express",
      label: "Express",
      duration: "2–4 Hari Kerja",
      extraPrice: 300000,
    },
  ],
},

{
  id: "stnk-hilang-mobil",
  title: "STNK Hilang / Rusak (Mobil)",
  description: "Pengurusan STNK mobil hilang atau rusak termasuk surat kehilangan & cek fisik kendaraan",
  category: "STNK",
  basePrice: 600000,
  options: [
    {
      type: "regular",
      label: "Reguler",
      duration: "7–10 Hari Kerja",
      extraPrice: 0,
    },
    {
      type: "express",
      label: "Express",
      duration: "3–5 Hari Kerja",
      extraPrice: 400000,
    },
  ],
},

{
  id: "mutasi-motor",
  title: "Mutasi Kendaraan (Motor)",
  description: "Pengurusan mutasi motor antar daerah (cabut berkas & daftar Samsat tujuan, STNK + plat baru)",
  category: "STNK",
  basePrice: 1200000,
  options: [
    {
      type: "regular",
      label: "Reguler",
      duration: "10–20 Hari Kerja",
      extraPrice: 0,
    },
    {
      type: "express",
      label: "Express",
      duration: "5–10 Hari Kerja",
      extraPrice: 500000,
    },
  ],
},

{
  id: "mutasi-mobil",
  title: "Mutasi Kendaraan (Mobil)",
  description: "Pengurusan mutasi mobil antar daerah termasuk STNK & plat baru",
  category: "STNK",
  basePrice: 1700000,
  options: [
    {
      type: "regular",
      label: "Reguler",
      duration: "10–20 Hari Kerja",
      extraPrice: 0,
    },
    {
      type: "express",
      label: "Express",
      duration: "5–10 Hari Kerja",
      extraPrice: 600000,
    },
  ],
},

{
  id: "balik-nama-stnk-motor",
  title: "Balik Nama STNK (Motor)",
  description: "Pengurusan balik nama STNK motor bekas (BBN). Bisa digabung pajak tahunan / 5 tahunan",
  category: "STNK",
  basePrice: 900000,
  options: [
    {
      type: "regular",
      label: "Reguler",
      duration: "7–14 Hari Kerja",
      extraPrice: 0,
    },
    {
      type: "express",
      label: "Express",
      duration: "2–4 Hari Kerja",
      extraPrice: 300000,
    },
  ],
},

{
  id: "balik-nama-stnk-mobil",
  title: "Balik Nama STNK (Mobil)",
  description: "Pengurusan balik nama STNK mobil bekas (BBN). Bisa digabung pajak tahunan / 5 tahunan",
  category: "STNK",
  basePrice: 1000000,
  options: [
    {
      type: "regular",
      label: "Reguler",
      duration: "7–14 Hari Kerja",
      extraPrice: 0,
    },
    {
      type: "express",
      label: "Express",
      duration: "2–4 Hari Kerja",
      extraPrice: 300000,
    },
  ],
},

{
  id: "pajak-5-tahunan-motor",
  title: "Pajak 5 Tahunan / Ganti Plat (Motor)",
  description: "Pengurusan pajak 5 tahunan motor termasuk cek fisik, STNK & plat nomor baru",
  category: "STNK",
  basePrice: 650000,
  options: [
    {
      type: "regular",
      label: "Reguler",
      duration: "5–7 Hari Kerja",
      extraPrice: 0,
    },
    {
      type: "express",
      label: "Express",
      duration: "2–3 Hari Kerja",
      extraPrice: 250000,
    },
  ],
},

{
  id: "pajak-5-tahunan-mobil",
  title: "Pajak 5 Tahunan / Ganti Plat (Mobil)",
  description: "Pengurusan pajak 5 tahunan mobil termasuk cek fisik, STNK & plat nomor baru",
  category: "STNK",
  basePrice: 900000,
  options: [
    {
      type: "regular",
      label: "Reguler",
      duration: "5–7 Hari Kerja",
      extraPrice: 0,
    },
    {
      type: "express",
      label: "Express",
      duration: "2–3 Hari Kerja",
      extraPrice: 350000,
    },
  ],
},

{
  id: "pajak-tahunan-motor",
  title: "Pajak Tahunan STNK (Motor)",
  description: "Pembayaran pajak tahunan motor (PKB + SWDKLLJ Jasa Raharja)",
  category: "STNK",
  basePrice: 250000,
  options: [
    {
      type: "regular",
      label: "Reguler",
      duration: "1–2 Hari Kerja",
      extraPrice: 0,
    },
    {
      type: "express",
      label: "Express",
      duration: "Same Day",
      extraPrice: 150000,
    },
  ],
},

{
  id: "pajak-tahunan-mobil",
  title: "Pajak Tahunan STNK (Mobil)",
  description: "Pembayaran pajak tahunan mobil (PKB + SWDKLLJ Jasa Raharja)",
  category: "STNK",
  basePrice: 350000,
  options: [
    {
      type: "regular",
      label: "Reguler",
      duration: "1–2 Hari Kerja",
      extraPrice: 0,
    },
    {
      type: "express",
      label: "Express",
      duration: "Same Day",
      extraPrice: 200000,
    },
  ],
},

  
  // ================= BPKB =================
{
  id: "balik-nama-bpkb-mobil",
  title: "Balik Nama BPKB (Mobil)",
  description: "Pengurusan balik nama BPKB mobil",
  duration: "14–21 Hari Kerja",
  basePrice: 1200000,
  category: "BPKB",
  options: [
    {
      type: "regular",
      label: "Reguler",
      duration: "14–21 Hari Kerja",
      extraPrice: 0,
    },
    {
      type: "express",
      label: "Express",
      duration: "2–4 Hari Kerja",
      extraPrice: 300000,
    },
  ]
},
{
  id: "balik-nama-bpkb-motor",
  title: "Balik Nama BPKB (Motor)",
  description: "Pengurusan balik nama BPKB motor",
  duration: "10–14 Hari Kerja",
  basePrice: 1000000,
  category: "BPKB",
  options: [
    {
      type: "regular",
      label: "Reguler",
      duration: "10–14 Hari Kerja",
      extraPrice: 0,
    },
    {
      type: "express",
      label: "Express",
      duration: "2–4 Hari Kerja",
      extraPrice: 300000,
    },
  ]
},
{
  id: "bpkb-hilang-mobil",
  title: "BPKB Hilang (Mobil)",
  description: "Pengurusan BPKB hilang mobil",
  duration: "21–30 Hari Kerja",
  basePrice: 1500000,
  category: "BPKB",
  options: [
    {
      type: "regular",
      label: "Reguler",
      duration: "21–30 Hari Kerja",
      extraPrice: 0,
    },
    {
      type: "express",
      label: "Express",
      duration: "2–4 Hari Kerja",
      extraPrice: 300000,
    },
  ]
},
{
  id: "bpkb-hilang-motor",
  title: "BPKB Hilang (Motor)",
  description: "Pengurusan BPKB hilang motor",
  duration: "14–21 Hari Kerja",
  basePrice: 1200000,
  category: "BPKB",
  options: [
    {
      type: "regular",
      label: "Reguler",
      duration: "14–21 Hari Kerja",
      extraPrice: 0,
    },
    {
      type: "express",
      label: "Express",
      duration: "2–4 Hari Kerja",
      extraPrice: 300000,
    },
  ]
},
{
  id: "cabut-berkas-bpkb-mobil",
  title: "Cabut Berkas + BPKB (Mobil)",
  description: "Cabut berkas sekaligus BPKB mobil",
  duration: "14–21 Hari Kerja",
  basePrice: 1800000,
  category: "BPKB",
  options: [
    {
      type: "regular",
      label: "Reguler",
      duration: "14–21 Hari Kerja",
      extraPrice: 0,
    },
    {
      type: "express",
      label: "Express",
      duration: "2–4 Hari Kerja",
      extraPrice: 300000,
    },
  ]
},
{
  id: "cabut-berkas-bpkb-motor",
  title: "Cabut Berkas + BPKB (Motor)",
  description: "Cabut berkas sekaligus BPKB motor",
  duration: "10–14 Hari Kerja",
  basePrice: 1600000,
  category: "BPKB",
  options: [
    {
      type: "regular",
      label: "Reguler",
      duration: "10–14 Hari Kerja",
      extraPrice: 0,
    },
    {
      type: "express",
      label: "Express",
      duration: "2–4 Hari Kerja",
      extraPrice: 300000,
    },
  ]
},


  // ================= MUTASI =================
  {
    id: "cabut-berkas-mobil",
    title: "Cabut Berkas Kendaraan (Mobil)",
    duration: "7–14 Hari Kerja",
    basePrice: 1500000,
    category: "Mutasi",
    options: [
      {
        type: "regular",
        label: "Reguler",
        duration: "7–14 Hari Kerja",
        extraPrice: 0,
      },
      {
        type: "express",
        label: "Express",
        duration: "2–4 Hari Kerja",
        extraPrice: 300000,
      },
    ]
  },
  {
    id: "cabut-berkas-motor",
    title: "Cabut Berkas Kendaraan (Motor)",
    duration: "7–14 Hari Kerja",
    basePrice: 1400000,
    category: "Mutasi",
    options: [
      {
        type: "regular",
        label: "Reguler",
        duration: "7–14 Hari Kerja",
        extraPrice: 0,
      },
      {
        type: "express",
        label: "Express",
        duration: "2–4 Hari Kerja",
        extraPrice: 300000,
      },
    ]
  },

  // ================= SIM =================
  {
    id: "sim-mobil",
    title: "Pembuatan SIM Mobil",
    duration: "1–3 Hari Kerja",
    basePrice: 800000,
    category: "SIM",
    options: [
      {
        type: "regular",
        label: "Reguler",
        duration: "1–3 Hari Kerja",
        extraPrice: 0,
      },
      {
        type: "express",
        label: "Express",
        duration: "2–4 Hari Kerja",
        extraPrice: 300000,
      },
    ]
  },
  {
    id: "sim-motor",
    title: "Pembuatan SIM Motor",
    duration: "1–3 Hari Kerja",
    basePrice: 600000,
    category: "SIM",
    options: [
      {
        type: "regular",
        label: "Reguler",
        duration: "1–3 Hari Kerja",
        extraPrice: 0,
      },
      {
        type: "express",
        label: "Express",
        duration: "2–4 Hari Kerja",
        extraPrice: 300000,
      },
    ]
  },

  // ================= PLAT NOMOR =================
  {
    id: "plat-1-no",
    title: "Plat Nomor 1 Angka (Tanpa Huruf)",
    description: "Plat nomor 1 angka tanpa huruf",
    duration: "7–14 Hari Kerja",
    basePrice: 20000000,
    category: "Plat Nomor",
    options: [
      {
        type: "regular",
        label: "Reguler",
        duration: "7–14 Hari Kerja",
        extraPrice: 0,
      },
      {
        type: "express",
        label: "Express",
        duration: "2–4 Hari Kerja",
        extraPrice: 300000,
      },
    ]
  },
  {
    id: "plat-1-yes",
    title: "Plat Nomor 1 Angka (Dengan Huruf)",
    description: "Plat nomor 1 angka dengan huruf",
    duration: "7–14 Hari Kerja",
    basePrice: 15000000,
    category: "Plat Nomor",
    options: [
      {
        type: "regular",
        label: "Reguler",
        duration: "7–14 Hari Kerja",
        extraPrice: 0,
      },
      {
        type: "express",
        label: "Express",
        duration: "2–4 Hari Kerja",
        extraPrice: 300000,
      },
    ]
  },
  {
    id: "plat-2-no",
    title: "Plat Nomor 2 Angka (Tanpa Huruf)",
    description: "Plat nomor 2 angka tanpa huruf",
    duration: "7–14 Hari Kerja",
    basePrice: 15000000,
    category: "Plat Nomor",
    options: [
      {
        type: "regular",
        label: "Reguler",
        duration: "7–14 Hari Kerja",
        extraPrice: 0,
      },
      {
        type: "express",
        label: "Express",
        duration: "2–4 Hari Kerja",
        extraPrice: 300000,
      },
    ]
  },
  {
    id: "plat-2-yes",
    title: "Plat Nomor 2 Angka (Dengan Huruf)",
    description: "Plat nomor 2 angka dengan huruf",
    duration: "7–14 Hari Kerja",
    basePrice: 10000000,
    category: "Plat Nomor",
    options: [
      {
        type: "regular",
        label: "Reguler",
        duration: "7–14 Hari Kerja",
        extraPrice: 0,
      },
      {
        type: "express",
        label: "Express",
        duration: "2–4 Hari Kerja",
        extraPrice: 300000,
      },
    ]
  },
  {
    id: "plat-3-no",
    title: "Plat Nomor 3 Angka (Tanpa Huruf)",
    description: "Plat nomor 3 angka tanpa huruf",
    duration: "7–14 Hari Kerja",
    basePrice: 10000000,
    category: "Plat Nomor",
    options: [
      {
        type: "regular",
        label: "Reguler",
        duration: "7–14 Hari Kerja",
        extraPrice: 0,
      },
      {
        type: "express",
        label: "Express",
        duration: "2–4 Hari Kerja",
        extraPrice: 300000,
      },
    ]
  },
  {
    id: "plat-3-yes",
    title: "Plat Nomor 3 Angka (Dengan Huruf)",
    description: "Plat nomor 3 angka dengan huruf",
    duration: "7–14 Hari Kerja",
    basePrice: 7500000,
    category: "Plat Nomor",
    options: [
      {
        type: "regular",
        label: "Reguler",
        duration: "7–14 Hari Kerja",
        extraPrice: 0,
      },
      {
        type: "express",
        label: "Express",
        duration: "2–4 Hari Kerja",
        extraPrice: 300000,
      },
    ]
  },
  {
    id: "plat-4-no",
    title: "Plat Nomor 4 Angka (Tanpa Huruf)",
    description: "Plat nomor 4 angka tanpa huruf",
    duration: "7–14 Hari Kerja",
    basePrice: 7500000,
    category: "Plat Nomor",
    options: [
      {
        type: "regular",
        label: "Reguler",
        duration: "7–14 Hari Kerja",
        extraPrice: 0,
      },
      {
        type: "express",
        label: "Express",
        duration: "2–4 Hari Kerja",
        extraPrice: 300000,
      },
    ]
  },
  {
    id: "plat-4-yes",
    title: "Plat Nomor 4 Angka (Dengan Huruf)",
    description: "Plat nomor 4 angka dengan huruf",
    duration: "7–14 Hari Kerja",
    basePrice: 5000000,
    category: "Plat Nomor",
    options: [
      {
        type: "regular",
        label: "Reguler",
        duration: "7–14 Hari Kerja",
        extraPrice: 0,
      },
      {
        type: "express",
        label: "Express",
        duration: "2–4 Hari Kerja",
        extraPrice: 300000,
      },
    ]
  },
];

