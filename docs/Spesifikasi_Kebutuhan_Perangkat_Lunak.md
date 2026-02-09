# Spesifikasi Kebutuhan Perangkat Lunak (SKPL) untuk BorneoTrip

## 1. Pendahuluan

### 1.1 Tujuan
Tujuan dari dokumen ini adalah untuk mendefinisikan kebutuhan perangkat lunak untuk platform **BorneoTrip**. Dokumen ini mencakup pengguna, kebutuhan fungsional, dan kebutuhan non-fungsional sebagai panduan bagi pengembang, penguji, dan pemangku kepentingan.

### 1.2 Lingkup
**BorneoTrip** adalah platform perjalanan dan pariwisata komprehensif yang didedikasikan untuk wilayah Borneo (Kalimantan). Platform ini memungkinkan pengguna untuk menemukan destinasi, memesan paket wisata dan acara, serta berinteraksi dengan mitra perjalanan. Sistem ini mendukung berbagai peran pengguna (Klien, Mitra, Admin) dan mengintegrasikan fitur pemesanan, pembayaran, dan komunikasi.

### 1.3 Definisi, Akronim, dan Singkatan
- **SKPL**: Spesifikasi Kebutuhan Perangkat Lunak (SRS)
- **MITRA**: Partner (Agen Perjalanan atau Penyelenggara Acara)
- **2FA**: Otentikasi Dua Faktor
- **CMS**: Sistem Manajemen Konten
- **EO**: Event Organizer (Penyelenggara Acara)

## 2. Deskripsi Umum

### 2.1 Perspektif Produk
BorneoTrip adalah aplikasi berbasis web yang dibangun dengan Next.js. Aplikasi ini berinteraksi dengan basis data relasional (MySQL/PostgreSQL melalui Prisma) untuk menyimpan data pengguna dan produk. Sistem ini dapat berintegrasi dengan gerbang pembayaran eksternal dan layanan peta (Mapbox/Google Maps).

### 2.2 Karakteristik Pengguna
1.  **Klien (Wisatawan)**:
    -   Mencari tur dan acara.
    -   Melakukan pemesanan dan pembayaran.
    -   Mengelola profil pribadi dan daftar keinginan (wishlist).
    -   Berkomunikasi dengan dukungan atau mitra melalui obrolan.
2.  **Mitra (Partner/Organizer)**:
    -   Mendaftar dan memverifikasi profil bisnis (memerlukan KTP/Lisensi).
    -   Membuat dan mengelola Paket Wisata dan Acara.
    -   Melihat pemesanan untuk produk mereka.
3.  **Administrator**:
    -   Mengelola semua pengguna dan persetujuan mitra.
    -   Memoderasi konten (Paket, Acara, Testimonial).
    -   Mengelola pengaturan sistem dan voucher.

### 2.3 Lingkungan Operasi
-   **Sisi Klien**: Peramban web modern (Chrome, Firefox, Safari, Edge) di Desktop dan Perangkat Seluler.
-   **Sisi Server**: Lingkungan Node.js (Next.js SSR/API Routes).
-   **Basis Data**: MySQL.

## 3. Fitur Sistem

### 3.1 Otentikasi & Otorisasi
-   **Pendaftaran/Login**: Pengguna dapat mendaftar melalui email/kata sandi.
-   **Akses Berbasis Peran**: Kemampuan berbeda untuk Klien, Mitra, dan Admin.
-   **Otentikasi Dua Faktor (2FA)**: Lapisan keamanan opsional untuk akun pengguna.
-   **Onboarding**: Alur panduan bagi pengguna baru untuk mengatur preferensi (minat, anggaran).

### 3.2 Manajemen Tur & Acara
-   **Katalog**: Daftar Paket Wisata dan Acara yang dapat ditelusuri dengan pemfilteran (Kategori, Lokasi, Harga).
-   **Detail Produk**: Tampilan detail termasuk judul/deskripsi yang dilokalisasi, rencana perjalanan (itinerary), jadwal, dan harga (Dewasa/Anak).
-   **Daftar Keinginan (Wishlist)**: Kemampuan pengguna untuk menyimpan item untuk nanti.
-   **Lokalisasi Konten**: Dukungan untuk berbagai bahasa (ID/EN) untuk judul dan deskripsi.

### 3.3 Sistem Pemesanan
-   **Alur Pemesanan**: Pengguna dapat memilih tanggal, jumlah pax (dewasa/anak), dan mengirimkan permintaan khusus.
-   **Metode Pembayaran**: Dukungan untuk Kartu Kredit, E-Wallet, dan Transfer Bank.
-   **Status Pemesanan**: Pelacakan melalui tahapan (Pending, Dibayar, Selesai, Dibatalkan).
-   **Voucher**: Penukaran kode promosi untuk diskon.

### 3.4 Manajemen Mitra (Mitra)
-   **Pendaftaran & Verifikasi**: Mitra menyerahkan detail bisnis dan dokumen (KTP, Lisensi) untuk persetujuan Admin.
-   **Dasbor**: Antarmuka bagi mitra untuk melihat kinerja produk dan status operasional mereka.

### 3.5 Komunikasi (Obrolan)
-   **Sesi Obrolan**: Pengguna dapat memulai sesi obrolan dengan dukungan atau mitra.
-   **Riwayat Pesan**: Penyimpanan riwayat percakapan yang persisten.
-   **Status**: Manajemen sesi (Buka/Tutup).

## 4. Kebutuhan Non-Fungsional

### 4.1 Kinerja
-   Pemuatan halaman yang dioptimalkan menggunakan Next.js Server-Side Rendering (SSR) dan Static Generation.
-   Pengiriman gambar yang efisien melalui optimasi dan CDN.

### 4.2 Keamanan
-   Penyimpanan kata sandi yang aman menggunakan hashing (misalnya, bcrypt).
-   Perlindungan terhadap kerentanan web umum (XSS, CSRF).
-   Penanganan informasi pembayaran yang aman.
-   Perlindungan data berbasis peran (mitra hanya dapat mengedit produk mereka sendiri).

### 4.3 Keandalan
-   Integritas data dipastikan oleh batasan basis data relasional (Skema Prisma).
-   Penanganan transaksional untuk pemesanan dan pembayaran.

### 4.4 Kegunaan
-   Desain responsif untuk pengalaman yang mulus di seluler dan desktop.
-   Navigasi dan fungsi pencarian yang intuitif.
-   Konten yang dilokalisasi untuk aksesibilitas yang lebih luas.
