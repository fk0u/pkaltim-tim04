# User Flow - BorneoTrip

Berikut adalah alur pengguna utama dalam aplikasi, mulai dari pendaratan hingga pasca-pembelian.

## 1. Discovery & Search (Pencarian Wisata)
**Goal**: User menemukan paket wisata yang sesuai dengan keinginan mereka.

1.  **Landing Page (`/`)**:
    *   User melihat video hero banner yang immersive.
    *   User menggunakan **Search Widget** (Lokasi, Tanggal, Tipe).
    *   *Action*: Klik "Cari" atau klik salah satu kartu "Destinasi Populer".

2.  **Explore Pages (`/packages` atau `/events`)**:
    *   User melihat daftar hasil pencarian.
    *   User menggunakan filter (Harga, Durasi, Kategori).
    *   *Action*: Klik kartu paket untuk melihat detail.

3.  **Detail Page (`/packages/[id]`)**:
    *   User membaca deskripsi lengkap, itinerary harian, dan apa yang termasuk.
    *   User melihat galeri foto.
    *   *Action*: Klik tombol "Book Now".

## 2. Booking & Checkout Process
**Goal**: User melakukan pemesanan dan pembayaran.

1.  **Pre-Checkout Check**:
    *   Sistem mengecek apakah user sudah login.
    *   *Decision*:
        *   Jika **Belum Login**: Redirect ke halaman Login (`/login`). Setelah login, redirect kembali ke Checkout.
        *   Jika **Sudah Login**: Lanjut ke halaman Checkout.

2.  **Checkout Page (`/checkout`)**:
    *   **Step 1: Review**: User melihat ringkasan pesanan (Nama Paket, Tanggal, Jumlah Pax, Total Harga).
    *   **Step 2: Payment**: User memilih metode pembayaran (Transfer, E-Wallet, QRIS) - *Simulasi*.
    *   **Step 3: Confirmation**: User mengklik "Bayar Sekarang".
    *   *System Action*: `addBooking()` dipanggil, data disimpan ke `Global Context` & `localStorage`.
    *   *Feedback*: Toast "Pembayaran Berhasil" muncul.

3.  **Post-Purchase (Dashboard)**:
    *   **Client Dashboard (`/dashboard/client`)**:
        *   User otomatis diarahkan ke dashboard setelah login/checkout.
        *   **Active Trip**: Kartu paket yang baru dibeli muncul paling atas sebagai "Active Trip".
        *   *Action*: User bisa melihat voucher, itinerary, atau menghubungi support.
    *   **Admin Dashboard (`/dashboard/admin`)** (Untuk Staff):
        *   Admin melihat statistik Total Revenue dan Total Booking bertambah.
        *   Admin melihat data booking user di tabel "Booking Terbaru".
        *   *Action*: Admin mengubah status booking (misal: dari Pending ke Confirmed).

## 4. Authentication Flow

*   **Registration (`/register`)**: User baru mengisi Nama, Email, Password. -> Auto Login -> Redirect ke Dashboard.
*   **Login (`/login`)**: User memilih role (Traveler/Staff). Input kredensial. -> Validasi Mock -> Redirect ke Dashboard sesuai Role.
