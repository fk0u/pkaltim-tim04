# Entity Relationship Diagram (ERD)

Meskipun saat ini menggunakan Mock Data, berikut adalah rancangan skema database relasional untuk BorneoTrip.

```mermaid
erDiagram
    USERS ||--o{ BOOKINGS : makes
    USERS {
        string id PK
        string name
        string email
        string password_hash
        string role "admin|client"
        string avatar_url
        int xp_points
        string membership_tier
    }

    PACKAGES ||--o{ BOOKINGS : included_in
    PACKAGES ||--o{ ITINERARY_DAYS : has
    PACKAGES {
        string id PK
        string title
        string location
        int price
        int duration_days
        float eco_rating
        text description
        string category
    }

    ITINERARY_DAYS ||--o{ ACTIVITIES : contains
    ITINERARY_DAYS {
        string id PK
        string package_id FK
        int day_number
        string title
    }

    ACTIVITIES {
        string id PK
        string day_id FK
        string time
        string title
        string type "meal|transport|activity"
    }

    BOOKINGS {
        string id PK
        string user_id FK
        string package_id FK
        date booking_date
        date travel_date
        int pax_count
        int total_amount
        string status "pending|paid|confirmed|cancelled"
        string payment_method
    }

    EVENTS {
        string id PK
        string title
        string location
        date event_date
        string category
        text description
    }
```

## Penjelasan Entitas

1.  **USERS**: Menyimpan data pengguna, baik traveler maupun admin. Menyimpan progres gamifikasi (XP/Tier).
2.  **PACKAGES**: Produk utama yang dijual. Berisi info dasar harga dan lokasi.
3.  **BOOKINGS**: Tabel transaksi. Menghubungkan User dengan Package. Punya status daur hidup transaksi.
4.  **ITINERARY_DAYS & ACTIVITIES**: Struktur detail untuk itinerary paket. Relasi One-to-Many berjenjang.
5.  **EVENTS**: Entitas terpisah untuk kalender event, tidak selalu transaksional (bisa hanya informatif).
