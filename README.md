# BorneoTrip 🌿🌏
> **Platform Pariwisata Berkelanjutan & Event Tahunan Kalimantan Timur**

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Version](https://img.shields.io/badge/version-1.1.0-blue)
![Status](https://img.shields.io/badge/status-Production%20Ready-green)
![License](https://img.shields.io/badge/license-MIT-green)

BorneoTrip adalah platform "Sustainable Tourism" yang menghubungkan wisatawan dengan keindahan alam, kekayaan budaya, dan event tahunan di Kalimantan Timur. Kami fokus pada pariwisata yang memberikan dampak positif bagi lingkungan dan masyarakat adat.

**[🌐 Live Demo URL](#)** | **[📄 Baca Dokumentasi](docs/)** | **[📊 Project Stats](docs/STATISTICS.md)**

![Project Banner](public/picture/city/samarinda.jpg)

## ✨ Fitur Unggulan

- **🌱 Sustainable Packages**: Paket wisata yang terkurasi berdasarkan *Eco-Rating*.
- **📅 Event Calendar**: Informasi lengkap event tahunan Kaltim (Erau, Festival Mahakam, dll).
- **💳 Seamless Booking**: Alur pemesanan modern dengan simulasi invoice dan e-voucher.
- **� Secure Authentication**: Login/Register dengan enkripsi bcrypt dan JWT session.
- **🗄️ Full Backend Implementation**: Database MySQL dengan Prisma ORM untuk manajemen data yang kuat.
- **👤 Role-Based Dashboard**:
  - **Traveler**: Gamifikasi level, riwayat trip, dan personalisasi.
  - **Mitra (Partner)**: Manajemen paket wisata (CRUD) secara mandiri.
  - **Admin**: Manajemen booking, CRM pelanggan, dan laporan pendapatan realtime.
- **🌍 Multi-Language**: Dukungan Bahasa Indonesia dan Inggris.

## 🛠️ Teknologi (Tech Stack)

Project ini dibangun dengan **Next.js Fullstack** untuk performa tinggi dan skalabilitas.

| Kategori | Teknologi | Kegunaan |
| :--- | :--- | :--- |
| **Framework** | [Next.js 14](https://nextjs.org/) | SSR, API Routes, Routing |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Type Safety |
| **Database** | [MySQL](https://www.mysql.com/) | Relational Database |
| **ORM** | [Prisma](https://www.prisma.io/) | Database Client & Migration |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | Utility-First CSS |
| **Icons** | [Lucide React](https://lucide.dev/) | Consistent Iconography |

## 🚀 Panduan Setup & Instalasi

Ikuti langkah ini untuk menjalankan BorneoTrip di komputer lokal Anda.

### Prasyarat
- Node.js (v18 atau lebih baru)
- MySQL Server (Localhost via XAMPP/Laragon atau Cloud)
- Git

### Langkah Instalasi

1. **Clone Repository**
   ```bash
   git clone https://github.com/username/borneotrip.git
   cd borneotrip
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Konfigurasi Environment**
   Salin `.env.example` ke `.env` (atau buat file baru) dan sesuaikan konfigurasi database:
   ```env
   # Database Connection (Contoh untuk XAMPP/Laragon default)
   DATABASE_URL="mysql://root:@localhost:3306/borneotrip_db"
   
   # JWT Secret untuk Authentication
   JWT_SECRET="rahasia_super_aman_ganti_ini"
   ```

4. **Setup Database & Migration**
   Jalankan perintah ini untuk membuat tabel database sesuai schema Prisma:
   ```bash
   npx prisma db push
   ```

5. **Seeding Database**
   Isi database dengan data awal (Paket Wisata, Event, Testimoni) agar aplikasi tidak kosong:
   ```bash
   npx tsx prisma/seed.ts
   ```

6. **Jalankan Aplikasi**
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) di browser.

## 🔑 Akun Demo (Seeding)

Jika Anda menjalankan seed script, Anda dapat menggunakan akun demo berikut atau mendaftar baru:

- **Admin**: `admin@borneotrip.id` / `admin123` (Untuk akses dashboard Admin)
- **User**: Daftar sendiri melalui halaman Register.

## 📂 Struktur Folder Baru (Backend Added)

```bash
src/
├── components/    # UI Components
├── contexts/      # React Context (Auth, Content connected to API)
├── pages/         
│   ├── api/       # Backend API Routes (Auth, Events, Packages, etc.)
│   └── ...        # Frontend Pages
├── lib/           # Utility Helper (Prisma Client, Auth Helper)
prisma/            
├── schema.prisma  # Database Schema Definition
└── seed.ts        # Database Seeding Script
```

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---
*Dibuat dengan ❤️ untuk Pariwisata Indonesia*
