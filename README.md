# BorneoTrip 🌿🌏
> **Platform Pariwisata Berkelanjutan & Event Tahunan Kalimantan Timur**

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Status](https://img.shields.io/badge/status-Demo%20Ready-orange)
![License](https://img.shields.io/badge/license-MIT-green)

BorneoTrip adalah platform "Sustainable Tourism" yang menghubungkan wisatawan dengan keindahan alam, kekayaan budaya, dan event tahunan di Kalimantan Timur. Kami fokus pada pariwisata yang memberikan dampak positif bagi lingkungan dan masyarakat adat.

**[🌐 Live Demo URL](#)** | **[📄 Baca Dokumentasi](docs/)** | **[📊 Project Stats](docs/STATISTICS.md)**

![Project Banner](public/picture/city/samarinda.jpg)

## ✨ Fitur Unggulan

- **🌱 Sustainable Packages**: Paket wisata yang terkurasi berdasarkan *Eco-Rating*.
- **📅 Event Calendar**: Informasi lengkap event tahunan Kaltim (Erau, Festival Mahakam, dll).
- **💳 Seamless Booking**: Alur pemesanan modern dengan simulasi invoice dan e-voucher.
- **🔄 Real-Time Mock Data**: Sistem *ContentContext* memungkinkan Partner menambah paket & Admin melihat statistik secara langsung (disimpan di Browser).
- **👤 Role-Based Dashboard**:
  - **Traveler**: Gamifikasi level, riwayat trip, dan personalisasi.
  - **Mitra (Partner)**: Manajemen paket wisata (CRUD) secara mandiri.
  - **Admin**: Manajemen booking, CRM pelanggan, dan laporan pendapatan realtime.
- **📱 Mobile-First Experience**: Desain responsif kelas industri (setara Traveloka/Tiket.com).
- **🌍 Multi-Language**: Dukungan Bahasa Indonesia dan Inggris.

## 📊 Status Proyek & Statistik

Kami menjaga transparansi pengembangan melalui metrik berikut (Realtime Update):

### Quick Stats
| Metric | Count |
| :--- | :--- |
| **Lines of Code** | **~7,200** |
| **Pages / Routes** | **31** |
| **UI Components** | **18** |
| **State Modules** | **4** |

### Completion Rate
- **Core Engine**: ██████████ 100%
- **UI/UX Design**: ██████████ 95%
- **Feature Mock**: ████████░░ 85%

*Lihat detail statistik di [docs/STATISTICS.md](docs/STATISTICS.md)*

## 🛠️ Teknologi (Tech Stack)

Project ini dibangun dengan **Next.js** dan teknologi modern lainnya untuk performa tinggi dan skalabilitas.

| Kategori | Teknologi | Kegunaan |
| :--- | :--- | :--- |
| **Framework** | [Next.js 14](https://nextjs.org/) | SSR & Routing Engine |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Type Safety |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | Utility-First CSS |
| **Animation** | [Framer Motion](https://www.framer.com/motion/) | Smooth Transitions |
| **Icons** | [Lucide React](https://lucide.dev/) | Consistent Iconography |
| **State** | React Context + LocalStorage | Persistence without Backend |

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
   ```

3. **Jalankan Development Server**
   ```bash
   npm run dev
   ```

4. **Buka di Browser**
   Buka [http://localhost:3000](http://localhost:3000) untuk melihat aplikasi.

## 👥 Top Contributors

Terima kasih kepada para kontributor yang telah membangun fondasi project ini:

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/tim-04">
        <img src="https://ui-avatars.com/api/?name=Lead+Dev&background=0D9488&color=fff" width="100px;" alt=""/>
        <br />
        <sub><b>Lead Frontend</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/design-lead">
        <img src="https://ui-avatars.com/api/?name=UI+UX&background=EA580C&color=fff" width="100px;" alt=""/>
        <br />
        <sub><b>UI/UX Designer</b></sub>
      </a>
    </td>
     <td align="center">
      <a href="https://github.com/pm-lead">
        <img src="https://ui-avatars.com/api/?name=Project+Manager&background=6366f1&color=fff" width="100px;" alt=""/>
        <br />
        <sub><b>Project Manager</b></sub>
      </a>
    </td>
  </tr>
</table>

## 📂 Struktur Folder

```bash
src/
├── components/    # Reusable UI Components (Cards, Buttons)
├── contexts/      # Global State (Auth, Booking, Content)
├── data/          # Mock Data (JSON)
├── pages/         # Application Routes
│   ├── dashboard/ # Role-based dashboards
│   ├── events/    # Event listing & details
│   └── packages/  # Package listing & details
├── styles/        # Global CSS & Tailwind Config
└── types/         # TypeScript Interfaces
```

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---
*Dibuat dengan ❤️ untuk Pariwisata Indonesia*
