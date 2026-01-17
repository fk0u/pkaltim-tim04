# Project Structure Documentation (PSD)

Struktur folder proyek ini mengikuti konvensi **Next.js Pages Router** yang dikombinasikan dengan arsitektur **Feature-First** (untuk komponen).

```
d:\Project\TIM-04
├── docs/                   # Dokumentasi Proyek (PRD, Architecture, ERD, dll)
├── public/                 # Aset statis (Gambar, Video, Logo)
│   ├── logo/
│   ├── picture/
│   └── video/              # Berisi 'bumper.webm'
├── src/
│   ├── components/         # Komponen UI Reusable
│   │   ├── layouts/        # Layout wrapper (Admin, Guest)
│   │   ├── ui/             # Atomic components (Button, Modal, Toast)
│   │   └── ...             # Feature components (SearchWidget, InteractiveMap)
│   ├── contexts/           # Global State Management
│   │   ├── AuthContext.tsx    # Manajemen Login/Register
│   │   ├── BookingContext.tsx # Manajemen Transaksi & Statistik
│   │   └── LanguageContext.tsx
│   ├── data/               # Mock Data (Database Simulasi)
│   │   └── mockData.ts     # Single source of truth untuk Events & Packages
│   ├── pages/              # Routing & Views
│   │   ├── api/            # API Routes (Next.js serverless functions - limited use)
│   │   ├── dashboard/      # Halaman Dashboard (Protected Routes)
│   │   │   ├── admin.tsx   # Dashboard Admin
│   │   │   └── client.tsx  # Dashboard User
│   │   ├── events/         # Fitur Event
│   │   ├── packages/       # Fitur Paket Wisata
│   │   ├── _app.tsx        # Global Wrapper (Context Providers)
│   │   └── index.tsx       # Homepage
│   ├── styles/             # Global CSS & Tailwind Directives
│   └── types/              # TypeScript Definitions
├── next.config.ts          # Konfigurasi Next.js
├── tailwind.config.ts      # Konfigurasi Tema & Warna
└── package.json            # Dependensi Proyek
```

## Key Files & Responsibilities

1.  **`src/data/mockData.ts`**:
    *   Berperan sebagai "Dummy Database". Semua data paket wisata, event, dan itinerari disimpan di sini.

2.  **`src/contexts/BookingContext.tsx`**:
    *   Logic inti aplikasi. Menghubungkan UI Checkout dengan Dashboard.
    *   Menggunakan `localStorage` key `bt_bookings` untuk persistensi data.

3.  **`src/pages/checkout.tsx`**:
    *   Orkestra utama proses pemesanan. Memvalidasi user login sebelum mengizinkan pembayaran.

4.  **`src/pages/dashboard/`**:
    *   Area privat yang tersegmentasi berdasarkan `user.role` dari `AuthContext`.
