# System Architecture

## High-Level Architecture
Aplikasi ini menggunakan arsitektur **Modulith (Modular Monolith)** pada sisi Frontend, dimana setiap fitur (Booking, Dashboard, Auth) dipisahkan secara logis namun berada dalam satu codebase Next.js.

```
[ Client Browser ]
       |
       v
[ Next.js Frontend Server (SSR/Static) ]
       |
  +----+----+
  |  Pages  |  <-- Routing & Entry Points
  +----+----+
       |
  +----+----+
  | Components |  <-- Atoms, Molecules, Organisms
  +---------+
       |
  +----+----+
  | Contexts |  <-- Global State (Auth, Language, Toast)
  +----+----+
       |
  +----+----+
  | Services |  <-- API Calls (Mocked / Real)
  +----+----+
```

## Tech Stack Details

### 1. Core Framework: Next.js (Pages Router)
Dipilih karena stabilitas, kemudahan SEO (penting untuk pariwisata), dan routing file-system yang intuitif.
- **SSR (Server Side Rendering)**: Halaman `packages/[id]` dirender di server untuk SEO optimal.
- **CSR (Client Side Rendering)**: Dashboard dan interaksi user bersifat client-side.

### 2. Styling Engine: Tailwind CSS
- **Utility-First**: Mempercepat development UI.
- **Config**: Kustomisasi warna `emerald` dan `amber` di `tailwind.config.ts`.
- **Responsive**: Breakpoints standar (`sm`, `md`, `lg`, `xl`) digunakan disiplin.

### 3. State Management: React Context API
Untuk skala aplikasi ini, Redux terlalu kompleks. Context API cukup untuk:
- `AuthContext`: Menyimpan sesi user dan role.
- `LanguageContext`: Menyimpan preferensi bahasa (i18n sederhana).
- `ToastContext`: Antrian notifikasi global.

### 4. Animation: Framer Motion
Digunakan untuk memberikan kesan "Premium App".
- Page Transitions (`AnimatePresence`).
- Micro-interactions (Button hover, Card scaling).
- Scroll animations (`whileInView`).

## Directory Structure Strategy

- `src/components/layouts`: Layout wrapper (Admin vs Client vs Landing). Menjaga konsistensi header/footer.
- `src/components/ui`: "Schadcn-like" reusable components (Modal, Button, Input). Memastikan konsistensi desain.
- `src/data`: Single source of truth untuk Mock Data. Memudahkan jika nanti ingin diganti dengan API real.

## Deployment Strategy
Aplikasi ini siap di-deploy ke **Vercel** atau **Netlify** dengan konfigurasi minimal. Karena tidak ada backend database riil (masih mock), aplikasi ini bersifat *stateless* dan sangat cepat.
