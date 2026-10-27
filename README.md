# BJ-UI (Biro Jasa Web Application)

Aplikasi web layanan biro jasa administrasi kendaraan (STNK, BPKB, Balik Nama, dsb.) berbasis **React 19**, **TypeScript**, dan **Vite**, yang dirancang dengan arsitektur modular yang skalabel, performan, dan mudah dirawat.

---

## 🏗️ Pola Arsitektur & Desain

Proyek ini mengadopsi **Feature-Based / Modular Architecture** (Domain-Driven Frontend) yang dipadukan dengan **Layered Service Pattern**:

1. **Feature-Driven / Domain Separation**: Kode dikelompokkan berdasarkan fitur dan domain fungsional, bukan sekadar berdasarkan tipe file generik (`pages/` atau `components/` global).
2. **Role Segregation**: Modul dipisahkan secara tegas antara domain **Admin** (`src/features/admin/`) dan domain **User/Pelanggan** (`src/features/user/`).
3. **Decoupled API Layer**: Seluruh komunikasi HTTP/REST API diisolasi ke dalam `src/api/` sehingga komponen UI tidak terikat langsung dengan detail protokol jaringan.
4. **Shared/Common UI Kit**: Komponen, layout, dan fungsi pembantu yang dapat digunakan lintas fitur dikumpulkan di `src/shared/`.

---

## 📁 Struktur Direktori

```text
BJ-UI/
├── src/
│   ├── api/                 # Data Access Layer (HTTP client, API service endpoints)
│   │   ├── auth.ts          # Layanan autentikasi & login
│   │   ├── customer.ts      # Layanan data pelanggan
│   │   ├── dashboard.ts     # Layanan data metrik dashboard
│   │   ├── invoice.ts       # Layanan penagihan & invoice
│   │   ├── order.ts         # Layanan transaksi & order
│   │   ├── services.ts      # Layanan katalog jasa/biaya
│   │   ├── shipping.ts      # Layanan logistik & ekspedisi berkas
│   │   └── vehicle.ts       # Layanan data master kendaraan (Brand, Model, Tipe)
│   │
│   ├── features/            # Modul logika bisnis aplikasi
│   │   ├── admin/           # Domain fitur khusus Administrator
│   │   │   ├── auth/        # Login & otentikasi admin
│   │   │   ├── dashboard/   # Dashboard & analitik transaksi
│   │   │   ├── invoice/     # Manajemen & verifikasi invoice
│   │   │   ├── settings/    # Pengaturan sistem
│   │   │   └── vehicles/    # Manajemen data master kendaraan & layanan
│   │   │       ├── components/ # Sub-komponen (BrandTab, ModelTab, ServiceTab)
│   │   │       └── VehiclesPage.tsx
│   │   │
│   │   └── user/            # Domain fitur Pelanggan / Publik
│   │       ├── checkout/    # Alur pengisian form & pembuatan pesanan
│   │       │   ├── components/ # Sub-kartu modular (Customer, Vehicle, Logistics, Upload, Summary)
│   │       │   ├── types.ts    # Kontrak tipe data checkout
│   │       │   └── CheckoutPage.tsx
│   │       ├── home/        # Beranda pelanggan
│   │       ├── invoice/     # Detail invoice & instruksi pembayaran
│   │       ├── ktl/         # Layanan Uji Emisi & KTL
│   │       ├── services/    # Estimasi biaya & katalog layanan
│   │       ├── success/     # Halaman status order berhasil
│   │       └── tracking/    # Pelacakan status pengerjaan berkas
│   │
│   ├── shared/              # Komponen & utilitas yang dipakai bersama (Reusable)
│   │   ├── components/      # UI kit umum (Button, Card, Modal, Input)
│   │   ├── layout/          # Shell global (Header, Footer, Navbar)
│   │   └── utils/           # Helper functions (format mata uang, tanggal, dsb.)
│   │
│   ├── context/             # Global client state (misal: ThemeContext / Dark Mode)
│   ├── router/              # Routing & navigasi aplikasi (AppRoutes.tsx)
│   ├── types/               # Definisi tipe TypeScript global
│   ├── App.tsx              # Root component
│   └── main.tsx             # Entry point aplikasi
│
├── public/                  # Aset statis publik
├── nginx.conf               # Konfigurasi reverse proxy / web server produksi
├── Dockerfile               # Konfigurasi containerization
└── vite.config.ts           # Konfigurasi Vite & bundling
```

---

## 🛠️ Tech Stack

* **Frontend Framework:** React 19
* **Language:** TypeScript 5.9
* **Build Tool:** Vite 7
* **Styling:** Tailwind CSS v4
* **Routing:** React Router v7
* **Icons:** Lucide React & React Icons
* **Animation:** Framer Motion
* **Charts:** Recharts
* **Notifications:** React Hot Toast

---

## 🚀 Panduan Memulai (Development)

### 1. Prasyarat
* [Node.js](https://nodejs.org/) v20+ atau versi LTS terbaru
* Package manager: `npm`

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment
Salin atau buat file `.env` pada root project:
```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

### 4. Perintah yang Tersedia (NPM Scripts)

* **Jalankan development server:**
  ```bash
  npm run dev
  ```
* **Build untuk produksi:**
  ```bash
  npm run build
  ```
* **Build untuk staging:**
  ```bash
  npm run build:staging
  ```
* **Linting kode:**
  ```bash
  npm run lint
  ```
* **Preview build produksi secara lokal:**
  ```bash
  npm run preview
  ```

---

## 📌 Konvensi Pengembangan

1. **Komposisi Komponen Kecil**:
   * Hindari membuat satu file komponen lebih dari 300–400 baris.
   * Pecah bagian form, tab, atau kartu yang berdiri sendiri ke dalam sub-folder `components/` milik fitur tersebut.
2. **Pemanggilan API**:
   * Jangan melakukan `fetch` atau pemanggilan Axios langsung di dalam komponen UI.
   * Selalu buat fungsi pembungkus di `src/api/` lengkap dengan deklarasi tipenya.
3. **Pemisahan Hak Akses**:
   * Fitur pelanggan berada di bawah `src/features/user/`.
   * Fitur admin berada di bawah `src/features/admin/` dan selalu menggunakan proteksi rute / token admin yang sesuai.
