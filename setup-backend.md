# Panduan Setup Backend BorneoTrip

Dokumen ini menjelaskan langkah-langkah detail untuk menyiapkan backend BorneoTrip (Next.js API Routes + Prisma + MySQL).

## 1. Prasyarat Sistem
Pastikan komputer Anda sudah terinstall:
- **Node.js**: v18 atau lebih baru.
- **MySQL Database**: Bisa menggunakan XAMPP, Laragon, atau Docker.
- **Git**: Untuk clone repository.

## 2. Konfigurasi Environment Variable
Buat file `.env` di root folder project dan isi konfigurasi berikut:

```env
# Koneksi Database
# Format: mysql://USER:PASSWORD@HOST:PORT/DATABASE_NAME
# Contoh default XAMPP/Laragon (User: root, Pass: kosong):
DATABASE_URL="mysql://root:@localhost:3306/borneotrip_db"

# JWT Secret (Untuk keamanan token login)
# Ganti dengan string acak yang panjang
JWT_SECRET="rahasia_dapur_borneotrip_2026"
```

## 3. Instalasi Dependency
Jalankan perintah ini di terminal untuk menginstall semua library yang dibutuhkan:

```bash
npm install
```

## 4. Setup Database (Prisma)
Langkah ini akan membuat tabel-tabel di database MySQL Anda sesuai skema yang ada di `prisma/schema.prisma`.

```bash
# 1. Generate Prisma Client (Wajib dijalankan setiap ada perubahan schema)
npx prisma generate

# 2. Push Schema ke Database (Membuat tabel otomatis)
npx prisma db push
```
*Catatan: Jika database `borneotrip_db` belum ada, perintah di atas akan membuatnya otomatis.*

## 5. Mengisi Data Awal (Seeding)
Agar aplikasi tidak kosong saat pertama dijalankan, kita perlu mengisi data contoh (Paket Wisata, Event, Testimoni).

```bash
npx tsx prisma/seed.ts
```
Jika berhasil, akan muncul pesan `Seeding finished.`.

## 6. Jalankan Server
Sekarang backend sudah siap. Jalankan server development:

```bash
npm run dev
```
Server akan berjalan di `http://localhost:3000`.

---

## Daftar Endpoint API Tersedia

| Method | Endpoint | Deskripsi | Auth Required |
| :--- | :--- | :--- | :--- |
| **AUTH & USER** | | | |
| `POST` | `/api/auth/register` | Pendaftaran user baru | No |
| `POST` | `/api/auth/login` | Login user (dapat Token) | No |
| `GET` | `/api/auth/me` | Cek profil user login | **Yes** |
| `PUT` | `/api/user/profile` | Update profil & preferensi | **Yes** |
| **PACKAGES** | | | |
| `GET` | `/api/packages` | List semua paket wisata | No |
| `GET` | `/api/packages/[id]` | Detail paket wisata | No |
| `POST` | `/api/packages` | Tambah paket baru | **Yes** |
| `PUT` | `/api/packages/[id]` | Update paket | **Yes** |
| `DELETE` | `/api/packages/[id]` | Hapus paket | **Yes** |
| **EVENTS** | | | |
| `GET` | `/api/events` | List event | No |
| `POST` | `/api/events` | Tambah event | **Yes** |
| **BOOKINGS** | | | |
| `GET` | `/api/bookings` | List booking user | **Yes** |
| `POST` | `/api/bookings` | Buat booking baru | **Yes** |
| `GET` | `/api/bookings/[id]` | Detail booking | **Yes** |
| **REGIONS** | | | |
| `GET` | `/api/regions` | List destinasi/region | No |
| `GET` | `/api/regions/[id]` | Detail destinasi | No |
| **TESTIMONIALS** | | | |
| `GET` | `/api/testimonials` | List testimoni | No |

## Tips Troubleshooting

- **Error: Connect ECONNREFUSED**: Pastikan MySQL (XAMPP/Laragon) sudah distart.
- **Error: P1001**: Cek kembali host dan port di `DATABASE_URL`.
- **Gambar tidak muncul**: Data seed menggunakan gambar dari internet (Unsplash). Pastikan koneksi internet lancar.
