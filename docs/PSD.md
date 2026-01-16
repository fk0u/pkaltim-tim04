# Product Specification Document (PSD)
**Project:** BorneoTrip Frontend Engineering
**Architecture Pattern:** Monolithic Frontend (Next.js Pages Directory)

## 1. System Overview
Aplikasi ini dibangun sebagai Single Page Application (SPA) hybrid menggunakan Next.js. Fokus utama adalah pada **Client-Side Interactivity** untuk memberikan nuansa aplikasi native.

## 2. Component Design System
Kami menggunakan sistem desain atomik yang dimodifikasi.

### 2.1. Basic Atoms (UI Kit)
- **Button**: Varian (Primary, Secondary, Ghost). State (Hover, Active, Disabled).
- **Input/Select**: Floating labels, error states.
- **Icons**: Lucide-React consistency (24px default).
- **Typography**: Sans-serif geometric font (Inter/Plus Jakarta Sans look-alike).

### 2.2. Molecules
- **PackageCard**: Image + Title + Price + Rating Badge.
- **EventCard**: Date Badge + Location + CTA.
- **SectionHeader**: Title + Subtitle + "View All" Link.

### 2.3. Organisms (Complex)
- **Navbar**: Responsive, sticky, glassmorphism, mobile drawer.
- **Footer**: Multi-column links + Socials + Newsletter.
- **BookingWidget**: Sticky sidebar dengan kalkulasi harga real-time.
- **AdminTable**: Sortable, filterable, pagination, status badges.

## 3. Data Flow Specification

### 3.1. Authentication
- **Simulation**: Menggunakan `AuthContext` (React Context) + `localStorage`.
- **States**: `isAuthenticated`, `user`, `role` ('client' | 'admin').
- **Protection**: HOC / Hooks (`useAuth`) pada halaman sensitif (`dashboard/*`).

### 3.2. Booking Flow Data
1.  **Selection**: User memilih `packageId`, `date`, `pax` (Package Detail).
2.  **Checkout**: Data dikirim via Router/Context ke halaman Checkout.
3.  **Submission**: Form submit -> Mock API Call -> Update Local State -> Redirect Success.

## 4. Asset Guidelines
- **Images**: Unsplash source untuk mock. Ratio 16:9 untuk Hero, 1:1 untuk Avatar, 4:3 untuk Cards.
- **Colors**:
  - Primary: Emerald Green (`#059669`, `#047857`) -> Kesan Alam/Hutan.
  - Secondary: Orange/Amber (`#f59e0b`) -> Kesan Hangat/Matahri/Borneo.
  - Neutral: Slate (`#f8fafc` to `#0f172a`).

## 5. Error Handling Specifications
- **Toast Notifications**: Wajib muncul untuk sukses/gagal aksi (e.g., "Booking Berhasil", "Login Gagal").
- **Empty States**: Tabel kosong harus menampilkan ilustrasi/teks help.
- **Loading States**: Skeleton loading pada saat fetch data (simulasi delay).
