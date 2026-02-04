export const documents = [
  {
    id: "DOC-2024-001",
    title: "Izin Usaha PT Maju Jaya",
    status: "Diproses",
    category: "Perizinan Usaha",
    progress: 60,
    updatedAt: "30 Jan 2024, 14:30",
    steps: [
      {
        title: "Pengajuan Diterima",
        date: "25 Jan 2024",
        description: "Dokumen persyaratan telah lengkap dan diverifikasi",
        done: true,
      },
      {
        title: "Verifikasi Dokumen",
        date: "26 Jan 2024",
        description: "Tim sedang memverifikasi keaslian dokumen",
        done: true,
      },
      {
        title: "Proses di Instansi",
        date: "28 Jan 2024",
        description: "Dokumen sedang diproses di instansi terkait",
        done: true,
      },
      {
        title: "Review & Validasi",
        date: null,
        description: "Menunggu validasi dari pihak berwenang",
        done: false,
      },
      {
        title: "Selesai",
        date: null,
        description: "Dokumen siap diambil atau dikirim",
        done: false,
      },
    ],
  },
  {
  id: "DOC-2024-002",
  title: "SKCK - Ahmad Suryadi",
  status: "Selesai",
  category: "Surat Keterangan",
  progress: 100,
  updatedAt: "29 Jan 2024, 09:15",
  steps: [
    {
      title: "Pengajuan Diterima",
      date: "25 Jan 2024",
      description: "Pengajuan SKCK berhasil diterima oleh sistem",
      done: true,
    },
    {
      title: "Verifikasi Dokumen",
      date: "26 Jan 2024",
      description: "Dokumen persyaratan telah diverifikasi",
      done: true,
    },
    {
      title: "Proses di Instansi",
      date: "27 Jan 2024",
      description: "SKCK diproses oleh pihak kepolisian",
      done: true,
    },
    {
      title: "Review & Validasi",
      date: "28 Jan 2024",
      description: "Hasil diverifikasi dan disetujui",
      done: true,
    },
    {
      title: "Selesai",
      date: "29 Jan 2024",
      description: "SKCK selesai dan siap diambil",
      done: true,
    },
  ],
  },
  {
  id: "DOC-2024-003",
  title: "Akta Pendirian CV Berkah",
  status: "Diproses",
  category: "Akta & Legalitas",
  progress: 40,
  updatedAt: "28 Jan 2024, 16:45",
  steps: [
    {
      title: "Pengajuan Diterima",
      date: "25 Jan 2024",
      description: "Pengajuan akta pendirian telah diterima",
      done: true,
    },
    {
      title: "Verifikasi Dokumen",
      date: "26 Jan 2024",
      description: "Dokumen sedang diverifikasi oleh tim",
      done: false, // 🔵 PROSES (active)
    },
    {
      title: "Proses Notaris",
      description: "Menunggu proses di notaris",
      done: false,
    },
    {
      title: "Pengesahan Kemenkumham",
      description: "Menunggu pengesahan",
      done: false,
    },
    {
      title: "Selesai",
      description: "Akta siap diambil",
      done: false,
    },
  ],
  },
  {
    id: "DOC-2024-004",
    title: "Perpanjangan SIUP",
    status: "Perlu Perhatian",
    category: "Perizinan Usaha",
    progress: 45,
    updatedAt: "27 Jan 2024, 11:00",
    steps: [
  {
    title: "Pengajuan Diterima",
    date: "25 Jan 2024",
    description: "Dokumen telah diverifikasi",
    done: true,
  },
  {
    title: "Verifikasi Dokumen",
    date: "26 Jan 2024",
    description: "Dokumen tidak lengkap, perlu perbaikan",
    done: false,
    warning: true, // ❗ MERAH
  },
  {
    title: "Proses di Instansi",
    description: "Menunggu perbaikan dokumen",
    done: false,
  },
]

    
  },
];