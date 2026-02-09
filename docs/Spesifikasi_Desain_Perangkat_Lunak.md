# Spesifikasi Desain Perangkat Lunak (SDPL) untuk BorneoTrip

## 1. Pendahuluan

### 1.1 Tujuan
Spesifikasi Desain Perangkat Lunak ini menjelaskan desain arsitektural, desain komponen, dan desain data untuk platform **BorneoTrip**. Dokumen ini berfungsi sebagai cetak biru untuk mengimplementasikan persyaratan yang diuraikan dalam SKPL (SRS).

### 1.2 Lingkup
Desain ini mencakup frontend (Next.js Pages Router), rute API backend, skema basis data (melalui Prisma), dan integrasi utama (Pembayaran, Peta, Email).

## 2. Arsitektur Sistem

### 2.1 Gambaran Umum
BorneoTrip menggunakan tumpukan web modern:
-   **Frontend**: Next.js (Pages Router) untuk SSR dan interaktivitas sisi klien.
-   **Styling**: Tailwind CSS untuk gaya yang mengutamakan utilitas.
-   **Backend**: Next.js API Routes (Fungsi Serverless) yang menangani logika bisnis.
-   **Basis Data**: Basis Data Relasional (MySQL) yang diakses melalui Prisma ORM.
-   **Otentikasi**: Implementasi khusus menggunakan cookie JWT/Sesi.

### 2.2 Struktur Direktori
```
/
├── prisma/             # Skema basis data dan migrasi
├── public/             # Aset statis (gambar, font)
├── src/
│   ├── components/     # Komponen UI yang dapat digunakan kembali (Tombol, formulir, tata letak)
│   ├── contexts/       # Konteks React (Auth, Tema)
│   ├── lib/            # Pustaka dan utilitas eksternal
│   ├── pages/          # Halaman Next.js (Routing)
│   │   ├── api/        # Titik akhir API Backend
│   ├── styles/         # Gaya global (CSS/Tailwind)
│   ├── types/          # Antarmuka/tipe TypeScript
│   └── utils/          # Fungsi pembantu
```

### 2.3 Teknologi Utama
-   **Framework**: Next.js 14+ (Pages Router)
-   **Bahasa**: TypeScript
-   **ORM**: Prisma
-   **Basis Data**: MySQL
-   **Otentikasi**: bcryptjs (hashing), jsonwebtoken (JWT)

## 3. Desain Data

### 3.1 Gambaran Umum Skema
Skema basis data didefinisikan dalam `prisma/schema.prisma`. Model utama meliputi:

#### Pengguna & Profil
-   `User`: Identitas inti (email, kata sandi, peran).
-   `PartnerProfile`: Atribut tambahan untuk verifikasi bisnis (KTP, Lisensi).
-   `Address`: Alamat pengiriman/penagihan pengguna.

#### Produk
-   `TourPackage`: Paket wisata terperinci dengan rencana perjalanan, harga, dan fasilitas.
-   `Event`: Acara terjadwal dengan tiket/kuota.
-   `Category`: Kategorisasi untuk paket/acara.
-   `Region`: Wilayah geografis (destinasi).

#### Perdagangan
-   `Booking`: Catatan transaksi yang menghubungkan Pengguna ke Paket/Acara.
-   `PaymentMethod`: Opsi pembayaran yang disimpan.
-   `Voucher`: Kode diskon dan pelacakan penggunaan.

#### Interaksi
-   `Testimonial`: Ulasan pengguna.
-   `ChatSession` / `Message`: Komunikasi Dukungan/Mitra.
-   `Wishlist`: Item yang disimpan.

## 4. Desain Komponen

### 4.1 Komponen Frontend
-   **Layout**: Komponen `Layout` membungkus halaman dengan `Navbar` dan `Footer`.
-   **Kartu Produk**: `PackageCard` dan `EventCard` untuk menampilkan item dalam daftar.
-   **Formulir**: Komponen input yang dapat digunakan kembali untuk UX yang konsisten (Pencarian, Pemesanan, Login).
-   **Widget Pemesanan**: Menangani pemilihan tanggal, jumlah pax, dan perhitungan harga awal.

### 4.2 Desain API Backend
Rute API diatur dalam `src/pages/api/`:
-   `/auth/*`: `login`, `register`, `me` (cek sesi).
-   `/packages/*`: Operasi CRUD untuk paket wisata.
-   `/events/*`: Operasi CRUD untuk acara.
-   `/bookings/*`: Buat, perbarui, lihat pemesanan.
-   `/user/*`: Manajemen profil dan pengaturan.

## 5. Desain Keamanan

### 5.1 Otentikasi
-   Manajemen sesi berbasis JWT.
-   Kata sandi di-hash dengan `bcrypt` sebelum disimpan.
-   Perlindungan middleware untuk rute `/dashboard` dan admin.

### 5.2 Otorisasi
-   Pemeriksaan peran (`client`, `mitra`, `admin`) pada titik akhir API yang sensitif.
-   Validasi kepemilikan sumber daya (Mitra hanya dapat mengedit paket mereka sendiri).

### 5.3 Perlindungan Data
-   Validasi input (misalnya, menggunakan `zod` atau pemeriksaan manual) pada rute API.
-   Sanitasi konten yang dibuat pengguna (ulasan, deskripsi).

## 6. Catatan Implementasi
-   **Internasionalisasi**: Lokalisasi berbasis JSON untuk konten dinamis.
-   **Penanganan Gambar**: Gambar disimpan sebagai URL (kemungkinan menunjuk ke Cloudinary/S3), direferensikan dalam DB.
-   **Alur Pembayaran**: Logika integrasi untuk menangani webhook gerbang pembayaran.
