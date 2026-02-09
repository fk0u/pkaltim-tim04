# Software Requirements Specification (SRS) for BorneoTrip

## 1. Introduction

### 1.1 Purpose
The purpose of this document is to define the software requirements for the **BorneoTrip** platform. This document covers users, functional requirements, and non-functional requirements to serve as a guide for developers, testers, and stakeholders.

### 1.2 Scope
**BorneoTrip** is a comprehensive travel and tourism platform dedicated to the Borneo region. It allows users to discover destinations, book tour packages and events, and interact with travel partners. The system supports multiple user roles (Clients, Partners, Admins) and integrates booking, payment, and communication features.

### 1.3 Definitions, Acronyms, and Abbreviations
- **SRS**: Software Requirements Specification
- **MITRA**: Partner (Travel Agent or Event Organizer)
- **2FA**: Two-Factor Authentication
- **CMS**: Content Management System
- **EO**: Event Organizer

## 2. Overall Description

### 2.1 Product Perspective
BorneoTrip is a web-based application built with Next.js. It interacts with a relational database (MySQL/PostgreSQL via Prisma) to store user and product data. It may integrate with external payment gateways and map services (Mapbox/Google Maps).

### 2.2 User Classes and Characteristics
1.  **Client (Traveler)**:
    -   Searches for tours and events.
    -   Makes bookings and payments.
    -   Manages personal profile and wishlists.
    -   Communicates with support or partners via chat.
2.  **Mitra (Partner/Organizer)**:
    -   Registers and verifies business profile (requires KTP/License).
    -   Creates and manages Tour Packages and Events.
    -   Views bookings for their products.
3.  **Administrator**:
    -   Manages all users and partner approvals.
    -   Moderates content (Packages, Events, Testimonials).
    -   Manages system settings and vouchers.

### 2.3 Operating Environment
-   **Client Side**: Modern web browsers (Chrome, Firefox, Safari, Edge) on Desktop and Mobile devices.
-   **Server Side**: Node.js environment (Next.js SSR/API Routes).
-   **Database**: MySQL.

## 3. System Features

### 3.1 Authentication & Authorization
-   **Registration/Login**: Users can sign up via email/password.
-   **Role-Based Access**: distinct capabilities for Client, Mitra, and Admin.
-   **Two-Factor Authentication (2FA)**: Optional security layer for user accounts.
-   **Onboarding**: Guided flow for new users to set preferences (interests, budget).

### 3.2 Tour & Event Management
-   **Catalog**: Browsable list of Tour Packages and Events with filtering (Category, Location, Price).
-   **Product Details**: Detailed view including localized title/description, itinerary, scheduling, and pricing (Adult/Child).
-   **Wishlist**: Ability for users to save items for later.
-   **Content Localization**: Support for multiple languages (ID/EN) for titles and descriptions.

### 3.3 Booking System
-   **Booking Flow**: Users can select dates, number of pax (adult/child), and submit special requests.
-   **Payment Methods**: Support for Credit Cards, E-Wallets, and Bank Transfers.
-   **Booking Status**: Tracking through stages (Pending, Paid, Completed, Cancelled).
-   **Vouchers**: Redemption of promotional codes for discounts.

### 3.4 Partner (Mitra) Management
-   **Registration & Verification**: Partners submit business details and documents (KTP, License) for Admin approval.
-   **Dashboard**: Interface for partners to view their product performance and operating status.

### 3.5 Communication (Chat)
-   **Chat Sessions**: Users can initiate chat sessions with support or partners.
-   **Message History**: persistent storage of conversation history.
-   **Status**: Session management (Open/Closed).

## 4. Non-Functional Requirements

### 4.1 Performance
-   Optimized page loads using Next.js Server-Side Rendering (SSR) and Static Generation.
-   Efficient image delivery via optimization and CDNs.

### 4.2 Security
-   Secure password storage using hashing (e.g., bcrypt).
-   Protection against common web vulnerabilities (XSS, CSRF).
-   Secure handling of payment information.
-   Role-based data protection (partners can only edit their own products).

### 4.3 Reliability
-   Data integrity ensured by relational database constraints (Prisma Schema).
-   Transactional handling for bookings and payments.

### 4.4 Usability
-   Responsive design for seamless experience on mobile and desktop.
-   Intuitive navigation and search functionality.
-   Localized content for broader accessibility.
