# Database Setup - BorneoTrip

## Technology Stack
- **Database**: SQLite (file-based, zero-config)
- **ORM**: Prisma v5.10.0
- **Location**: `./prisma/dev.db`

## Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database (One Command)
```bash
npm run db:setup
```
This will:
- Generate Prisma Client
- Create SQLite database
- Run migrations
- Seed with mock data

### 3. Verify Database
```bash
npm run db:studio
```
Opens Prisma Studio at `http://localhost:5555`

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed database with mock data |
| `npm run db:studio` | Open Prisma Studio GUI |
| `npm run db:setup` | Complete setup (generate + push + seed) |

## Database Schema

### Tables
1. **User** - Travelers, partners, admins
2. **Event** - Annual events (Festival Erau, Eco-Marathon, etc.)
3. **TourPackage** - Tour packages with pricing
4. **ItineraryDetail** - Day-by-day itinerary
5. **Booking** - User bookings for events/packages
6. **Testimonial** - User reviews
7. **Region** - East Kalimantan regions data

### Relationships
```
User ──┬─< Booking >── Event
       └─< Booking >── TourPackage

TourPackage ─── ItineraryDetail (1:1)
```

## Sample Data
Database seeded with:
- ✅ 10 Regions (Berau, Samarinda, Balikpapan, etc.)
- ✅ 10+ Events (Festival Erau, Derawan Eco-Marathon, etc.)
- ✅ 15+ Tour Packages
- ✅ 10+ Testimonials

## Environment Variables

Create `.env` file:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="borneo-trip-secret-key-2026-hackathon"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

## API Integration

All API endpoints in `/src/pages/api/*` now connected to SQLite database:

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Events
- `GET /api/events` - List all events
- `GET /api/events/[id]` - Get event detail

### Packages
- `GET /api/packages` - List all tour packages
- `GET /api/packages/[id]` - Get package detail

### Bookings
- `GET /api/bookings` - List user bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/[id]` - Get booking detail

### Regions
- `GET /api/regions` - List all regions
- `GET /api/regions/[id]` - Get region detail

### Testimonials
- `GET /api/testimonials` - List all testimonials

### User Profile
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

## Development Workflow

### Reset Database
```bash
rm prisma/dev.db
npm run db:setup
```

### Update Schema
1. Edit `prisma/schema.prisma`
2. Run `npm run db:push`
3. Regenerate client with `npm run db:generate`

### Add More Seed Data
Edit `prisma/seed.ts` and run:
```bash
npm run db:seed
```

## Production Notes

For production deployment:
- Consider PostgreSQL/MySQL for better concurrency
- Current setup is perfect for demo/hackathon
- Database file size: ~2-5MB with sample data
- Offline-capable (no network required)

## Troubleshooting

### "prisma command not found"
```bash
npm install
```

### "Database locked"
Close Prisma Studio and restart dev server

### "Migration failed"
```bash
rm prisma/dev.db
npm run db:push
npm run db:seed
```

### View Database File Directly
```bash
sqlite3 prisma/dev.db
.tables
.schema User
```

## Demo-Ready Checklist
- [x] SQLite database configured
- [x] Schema migrated
- [x] Sample data seeded
- [x] API endpoints connected
- [x] Prisma Studio accessible
- [x] Authentication working
- [x] Booking system functional
