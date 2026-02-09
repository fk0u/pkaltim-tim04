# Software Design Specification (SDS) for BorneoTrip

## 1. Introduction

### 1.1 Purpose
This Software Design Specification describes the architectural design, component design, and data design for the **BorneoTrip** platform. It serves as a blueprint for implementing the requirements outlined in the SRS.

### 1.2 Scope
The design covers the frontend (Next.js Pages Router), backend API routes, database schema (via Prisma), and key integrations (Payment, Maps, Email).

## 2. System Architecture

### 2.1 Overview
BorneoTrip utilizes a modern web stack:
-   **Frontend**: Next.js (Pages Router) for SSR and client-side interactivity.
-   **Styling**: Tailwind CSS for utility-first styling.
-   **Backend**: Next.js API Routes (Serverless Functions) handling business logic.
-   **Database**: Relational Database (MySQL) accessed via Prisma ORM.
-   **Authentication**: Custom implementation using JWT/Session cookies.

### 2.2 Directory Structure
```
/
├── prisma/             # Database schema and migrations
├── public/             # Static assets (images, fonts)
├── src/
│   ├── components/     # Reusable UI components (Buttons, forms, layouts)
│   ├── contexts/       # React Context (Auth, Theme)
│   ├── lib/            # External libraries and utilities
│   ├── pages/          # Next.js Pages (Routing)
│   │   ├── api/        # Backend API endpoints
│   ├── styles/         # Global styles (CSS/Tailwind)
│   ├── types/          # TypeScript interfaces/types
│   └── utils/          # Helper functions
```

### 2.3 Key Technologies
-   **Framework**: Next.js 14+ (Pages Router)
-   **Language**: TypeScript
-   **ORM**: Prisma
-   **Database**: MySQL
-   **Authentication**: bcryptjs (hashing), jsonwebtoken (JWT)

## 3. Data Design

### 3.1 Schema Overview
The database schema is defined in `prisma/schema.prisma`. Key models include:

#### Users & Profiles
-   `User`: Core identity (email, password, role).
-   `PartnerProfile`: Extended attributes for business verification (KTP, License).
-   `Address`: User shipping/billing addresses.

#### Products
-   `TourPackage`: Detailed travel packages with itineraries, pricing, and facilities.
-   `Event`: Scheduled events with ticketing/quota.
-   `Category`: Categorization for packages/events.
-   `Region`: Geographic regions (destinations).

#### Commerce
-   `Booking`: Transaction records linking Users to Packages/Events.
-   `PaymentMethod`: Stored payment options.
-   `Voucher`: Discount codes and usage tracking.

#### Interactions
-   `Testimonial`: User reviews.
-   `ChatSession` / `Message`: Support/Partner communication.
-   `Wishlist`: Saved items.

## 4. Component Design

### 4.1 Frontend Components
-   **Layout**: `Layout` component wraps pages with `Navbar` and `Footer`.
-   **Product Cards**: `PackageCard` and `EventCard` for displaying items in lists.
-   **Forms**: Reusable input components for consistent UX (Search, Booking, Login).
-   **Booking Widget**: Handles date selection, pax count, and initial price calculation.

### 4.2 Backend API Design
API routes are organized in `src/pages/api/`:
-   `/auth/*`: `login`, `register`, `me` (session check).
-   `/packages/*`: CRUD operations for tour packages.
-   `/events/*`: CRUD operations for events.
-   `/bookings/*`: Create, update, view bookings.
-   `/user/*`: Profile and settings management.

## 5. Security Design

### 5.1 Authentication
-   JWT-based session management.
-   Passwords hashed with `bcrypt` before storage.
-   Middleware protection for `/dashboard` and admin routes.

### 5.2 Authorization
-   Role checks (`client`, `mitra`, `admin`) on sensitive API endpoints.
-   Resource ownership validation (Partners can only edit their own packages).

### 5.3 Data Protection
-   Input validation (e.g., using `zod` or manual checks) on API routes.
-   Sanitization of user-generated content (reviews, descriptions).

## 6. Implementation Notes
-   **Internationalization**: JSON-based localization for dynamic content.
-   **Image Handling**: Images stored as URLs (likely pointing to Cloudinary/S3), referenced in DB.
-   **Payment Flow**: Integration logic to handle payment gateway webhooks.
