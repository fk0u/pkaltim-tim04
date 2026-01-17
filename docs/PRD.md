# Product Requirements Document (PRD) - BorneoTrip

**Version**: 1.1 Final
**Date**: 17 Jan 2026
**Status**: Completed

## 1. Executive Summary
BorneoTrip adalah platform pariwisata digital yang dirancang untuk mempromosikan pariwisata berkelanjutan (sustainable tourism) di Kalimantan Timur, khususnya sekitar IKN (Ibu Kota Nusantara). Platform ini berfokus pada pengalaman pengguna yang immersive, transparansi dampak lingkungan, dan kemudahan pemesanan paket wisata lokal.

## 2. Objectives
*   **Showcase Quality**: Menyediakan antarmuka setara OTA (Online Travel Agent) unicorn (Traveloka, tiket.com) untuk keperluan hackathon.
*   **Sustainability Focus**: Menonjolkan aspek ramah lingkungan di setiap paket wisata.
*   **Zero-Backend**: Berjalan sepenuhnya di sisi client (browser) dengan simulasi data yang realistis.

## 3. User Roles
*   **Traveler (Client)**: Pengguna umum yang mencari dan memesan paket wisata.
*   **Admin/Operator**: Pengelola platform yang memantau booking dan pendapatan.

## 4. Features & Status

### A. Core Features
| Feature | Description | Priority | Status |
| :--- | :--- | :--- | :--- |
| **Landing Page** | Video background, interactive search, feature highlights. | P0 | ✅ **Done** |
| **Package Discovery** | Listing paket dengan filter, search, dan sorting. | P0 | ✅ **Done** |
| **Package Detail** | Halaman detail dengan itinerary, gallery, dan 'What's Included'. | P0 | ✅ **Done** |
| **Event Calendar** | Listing event tahunan dengan tanggal dan lokasi. | P1 | ✅ **Done** |
| **Authentication** | Login & Register dengan pemisahan role (Client/Admin). | P0 | ✅ **Done** |
| **Booking System** | Flow checkout simulasi dengan persistensi data lokal. | P0 | ✅ **Done** |

### B. User Dashboard
| Feature | Description | Priority | Status |
| :--- | :--- | :--- | :--- |
| **Client Dashboard** | Menampilkan 'Active Trip', history, dan profil user. | P1 | ✅ **Done** |
| **Admin Dashboard** | Statistik revenue, tabel booking terbaru, manajemen status. | P1 | ✅ **Done** |
| **E-Voucher** | Modal popup menampilkan QR Code booking. | P2 | ✅ **Done** |

### C. Content Pages
| Feature | Description | Priority | Status |
| :--- | :--- | :--- | :--- |
| **Sustainability** | Halaman edukasi tentang dampak lingkungan & donasi. | P2 | ✅ **Done** |
| **About Us** | Informasi tim dan visi misi. | P3 | ✅ **Done** |
| **Contact** | Formulir kontak fungsional (UI only). | P3 | ✅ **Done** |

## 5. Non-Functional Requirements
*   **Performance**: Loading time < 2 detik (tercapai dengan Next.js & Turbopack).
*   **Responisve**: Layout adaptif untuk Mobile, Tablet, dan Desktop.
*   **Persistency**: Data user dan booking tidak hilang saat refresh browser (menggunakan `localStorage`).

## 6. Future Roadmap (Post-Demo)
*   Integrasi Payment Gateway (Midtrans/Xendit).
*   Backend Database (PostgreSQL/Supabase).
*   CMS untuk manajemen konten paket wisata real-time.
