# API Documentation - BorneoTrip

## Authentication

### Register
`POST /api/auth/register`
- **Body**: `{ "name": "John", "email": "john@example.com", "password": "pass" }`
- **Response**: User object + JWT Token

### Login
`POST /api/auth/login`
- **Body**: `{ "email": "john@example.com", "password": "pass" }`
- **Response**: User object + JWT Token

### Get Profile
`GET /api/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Current user profile

### Update Profile
`PUT /api/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ "name": "New Name", "preferences": { ... } }`
- **Response**: Updated user profile

### Logout
`POST /api/auth/logout`
- **Response**: Success message

---

## Events

### List Events
`GET /api/events`
- **Query**: `?search=kuta&category=Culture`
- **Response**: Array of events

### Create Event (Admin/Mitra)
`POST /api/events`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: Event object
- **Response**: Created event

### Update Event (Admin/Mitra)
`PUT /api/events/[id]`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: Event object fields
- **Response**: Updated event

### Delete Event (Admin/Mitra)
`DELETE /api/events/[id]`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Success confirmation

---

## Packages

### List Packages
`GET /api/packages`
- **Query**: `?minPrice=1000&ecoRating=4`
- **Response**: Array of packages

### Create Package (Admin/Mitra)
`POST /api/packages`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: Package object
- **Response**: Created package

### Update Package (Admin/Mitra)
`PUT /api/packages/[id]`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: Package object fields
- **Response**: Updated package

### Delete Package (Admin/Mitra)
`DELETE /api/packages/[id]`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Success confirmation

---

## Bookings

### Create Booking
`POST /api/bookings`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ "packageId": "p1" }` OR `{ "eventId": "e1" }`
- **Response**: Created booking (pending)

### List Bookings
`GET /api/bookings`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: User's bookings

### Update Status (Admin)
`PUT /api/bookings/[id]`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ "status": "confirmed" }`
- **Response**: Updated booking

### Delete/Cancel Booking
`DELETE /api/bookings/[id]`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Success confirmation

---

## Admin

### Statistics
`GET /api/admin/stats`
- **Headers**: `Authorization: Bearer <token>` (Admin Only)
- **Response**: Dashboard stats (revenue, users, etc.)
