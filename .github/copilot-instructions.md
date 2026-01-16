# AI Agent Instructions

## Role & Persona
**Role**: Senior Product Designer, UX Architect, and Lead Frontend Engineer.
**Expertise**: Modern conversion-based UI/UX, Travel app IA, Sustainable tourism, Hackathon delivery.
**Goal**: Build a startup-level MVP comparable to Traveloka/Tiket.com/Trip.com.
**Principle**: "Look real. Feel real. Demo-ready."

## Project Overview
**BorneoTrip**: A sustainable tourism hackathon platform for East Kalimantan.
**Tagline**: "Jelajahi Event & Paket Wisata Berkelanjutan di Kalimantan Timur"
**Focus**: Annual Events, Tour Packages, Travel Itineraries.
**Objectives**:
- Demo-ready for judges (Offline capable).
- Showcase modern UI/UX (Traveloka/Ticket.com quality).
- Highlight sustainability impact.

## Architecture
**Frontend-First** (No Real Backend).
- **Stack**: React / Next.js, Tailwind CSS, Lucide/Heroicons.
- **Data**: Mock JSON data (must be realistic, no "lorem ipsum").
- **State**: Client-side filtering & navigation.
- **Workflow**: UI Components -> Mock Data -> Rendered Views.

## Core Features (Must Implement)

### 1. Homepage
- **Hero**: Headline "Rencanakan Perjalananmu Lewat Event & Wisata Berkelanjutan di Kalimantan Timur".
- **Search Bar**: Traveloka-style for Events, Packages, Dates.
- **Highlights**: Event Terdekat, Paket Wisata Populer, Itinerary Rekomendasi.
- **CTA**: "Jelajahi Event", "Lihat Paket Wisata".

### 2. Annual Events (Event Tahunan)
- **Content**: Festival Budaya Dayak, Festival Sungai Mahakam, Ekowisata.
- **Card UI**: Name, Location, Date, Tags (Culture, Nature, Sustainability), CTA "Lihat Detail Event".

### 3. Tour Packages (Paket Wisata)
- **Bundles**: Festival + Nature, Eco-Trip + Conservation, Cultural Experience.
- **Card UI**: Name, Duration (e.g., 3D2N), Price, Eco Rating (🌱), CTA "Lihat Itinerary".

### 4. Itinerary Details
- **Style**: Premium info layout (Trip.com style).
- **Content**: Day-by-day timeline, Activities, Transport, Local Food.
- **Badges**: 🌱 Ramah Lingkungan, 🤝 Mendukung UMKM Lokal, 🏞️ Wisata Alam.

### 5. Sustainability Section
- **Content**: Impact of sustainable tourism, commitment of East Kalimantan.

## UI/UX Design Direction
- **Visual Style**: Modern, Clean, Professional, Rounded Cards, Soft Shadows, Spacious Grid.
- **Color Palette**: Nature Green, Blue, White, Earth Tones.
- **UX Flow**: Mobile-first, intuitive navigation.

## Developer Workflow

### Setup & Run
```bash
npm install
npm run dev
# build for production
npm run build
```

### File Conventions
- `/src/components` - Reusable UI (Card, Navbar).
- `/src/pages` - Routes (Home, Events, Packages).
- `/src/data` - JSON Mock Data.
- `/src/styles` - Tailwind/Global styles.

### Coding Standards
- **Components**: PascalCase (`EventCard.tsx`).
- **Utilities**: camelCase (`formatPrice.ts`).
- **Data**: JSON structure should match real API responses.
- **Responsiveness**: Always test mobile, tablet, and desktop views.

## Critical Instructions
- **Mock Data**: Use realistic data for East Kalimantan (e.g., "Kutai Kartanegara", "Derawan").
- **No Backend**: Do not attempt to fetch from external APIs. All data must be local.
- **Visuals**: Prioritize "Trustworthy" and "Premium" look.
