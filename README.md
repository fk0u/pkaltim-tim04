# BorneoTrip 🌿🌏
> **Platform Pariwisata Berkelanjutan & Event Tahunan Kalimantan Timur**

BorneoTrip adalah platform "Sustainable Tourism" yang menghubungkan wisatawan dengan keindahan alam, kekayaan budaya, dan event tahunan di Kalimantan Timur. Kami fokus pada pariwisata yang memberikan dampak positif bagi lingkungan dan masyarakat adat.

![Project Banner](https://images.unsplash.com/photo-1596401057633-565652b5d249?auto=format&fit=crop&q=80)
*(Note: Replace with actual screenshot)*

## ✨ Fitur Unggulan

- **🌱 Sustainable Packages**: Paket wisata yang terkurasi berdasarkan *Eco-Rating*.
- **📅 Event Calendar**: Informasi lengkap event tahunan Kaltim (Erau, Festival Mahakam, dll).
- **💳 Seamless Booking**: Alur pemesanan modern dengan simulasi invoice dan e-voucher.
- **👤 Role-Based Dashboard**:
  - **Traveler**: Gamifikasi level, riwayat trip, dan personalisasi.
  - **Admin**: Manajemen booking, CRM pelanggan, dan laporan pendapatan.
- **📱 Mobile-First Experience**: Desain responsif kelas industri (setara Traveloka/Tiket.com).
- **🌍 Multi-Language**: Dukungan Bahasa Indonesia dan Inggris.

## 🛠️ Teknologi (Tech Stack)

Project ini dibangun dengan **Next.js** dan teknologi modern lainnya untuk performa tinggi dan skalabilitas.

- **Framework**: [Next.js 14](https://nextjs.org/) (Pages Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React Context API
- **Maps**: Leaflet / Static Maps integration

## 🚀 Cara Menjalankan Project

Ikuti langkah ini untuk menjalankan BorneoTrip di lokal komputer Anda.

### Prasyarat
- Node.js (v18 atau lebih baru)
- npm / yarn / pnpm

### Instalasi

1. **Clone Repository**
   ```bash
   git clone https://github.com/username/borneotrip.git
   cd borneotrip
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # atau
   yarn install
   ```

3. **Jalankan Development Server**
   ```bash
   npm run dev
   ```

4. **Buka di Browser**
   Buka [http://localhost:3000](http://localhost:3000) untuk melihat aplikasi.

## 📂 Struktur Project

```
d:\Project\TIM-04\
├── src\
│   ├── components\     # Reusable UI components (Navbar, Footer, Cards)
│   ├── contexts\       # Global State (Auth, Language)
│   ├── data\           # Mock Data (Packages, Events, Users)
│   ├── pages\          # Routes (Home, Dashboard, Booking)
│   │   ├── dashboard\  # Client & Admin Dashboards
│   │   └── packages\   # Dynamic Package Details
│   └── styles\         # Global CSS & Tailwind config
├── docs\               # Dokumentasi Detail (PRD, PSD, ERD)
└── public\             # Static Assets
```

## 📚 Dokumentasi Lengkap

Kami menyediakan dokumentasi detail untuk pengembangan dan pemahaman produk:

- **[Product Requirements Document (PRD)](docs/PRD.md)** - Visi, Misi, dan Spesifikasi Produk.
- **[System Architecture](docs/ARCHITECTURE.md)** - Desain teknis dan struktur kode.
- **[User Flow & UX](docs/USERFLOW.md)** - Diagram alur pengguna.
- **[Database Schema (ERD)](docs/ERD.md)** - Rancangan basis data.
- **[User Personas](docs/USER_PERSONA.md)** - Target audiens dan analisis pengguna.
- **[Pain Points Analysis](docs/PAIN_POINTS.md)** - Masalah yang diselesaikan aplikasi ini.

## 🤝 Contributing

Lihat [CONTRIBUTING.md](CONTRIBUTING.md) untuk panduan kontribusi.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
**BorneoTrip Team** © 2026 - Hackathon Project TIM-04.
*Jelajahi Kaltim, Jaga Bumi.*
