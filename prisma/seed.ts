import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL
})

async function main() {
    const REGIONS = [
        {
            id: 1,
            name: "Berau",
            type: "Kabupaten",
            capital: "Tanjung Redeb",
            leader: "Sri Juniarsih Mas",
            area: "21.917",
            population: "265.300",
            density: "12,1",
            districts: 13,
            villages: "10/100",
            coordinates: { lat: 2.1491, lng: 117.4933 },
            destinations: ["Kepulauan Derawan", "Danau Labuan Cermin", "Gua Haji Mangku", "Pulau Kakaban"],
            imageUrl: "https://jadesta.kemenparekraf.go.id/imgpost/62567.jpg?auto=format&fit=crop&q=80"
        },
        {
            id: 2,
            name: "Kutai Barat",
            type: "Kabupaten",
            capital: "Sendawar",
            leader: "Frederick Edwin",
            area: "20.382",
            population: "180.310",
            density: "8,8",
            districts: 16,
            villages: "4/190",
            coordinates: { lat: -0.2173, lng: 115.6961 },
            destinations: ["Gua Pendorong", "Air Terjun Jantur Inar", "Cagar Alam Kersik Luway"],
            imageUrl: "https://wonderfulindonesia.co.id/wp-content/uploads/2025/03/Air-Terjun-Jantur-Inar-1.webp?auto=format&fit=crop&q=80"
        },
        {
            id: 3,
            name: "Kutai Kartanegara",
            type: "Kabupaten",
            capital: "Tenggarong",
            leader: "Aulia Rahman Basri",
            area: "23.602",
            population: "845.620",
            density: "35,8",
            districts: 18,
            villages: "44/193",
            coordinates: { lat: -0.4005, lng: 116.9835 },
            destinations: ["Taman Nasional Kutai", "Museum Mulawarman", "Desa Budaya Lekaq Kidau", "Pulau Kumala"],
            imageUrl: "https://upload.wikimedia.org/wikipedia/commons/3/34/Museum_Mulawarman.jpg?auto=format&fit=crop&q=80"
        },
        {
            id: 4,
            name: "Kutai Timur",
            type: "Kabupaten",
            capital: "Sangatta",
            leader: "Ardiansyah Sulaiman",
            area: "31.586",
            population: "470.400",
            density: "14,9",
            districts: 18,
            villages: "2/139",
            coordinates: { lat: 0.5053, lng: 117.5332 },
            destinations: ["Pantai Teluk Lombok", "Taman Nasional Kutai", "Gua Karst Mangkalihat", "Pantai Aquatic"],
            imageUrl: "https://selasar.co/assets/images/news/2023/11/taman-nasional-kutai-surga-alam-di-kalimantan-timur-655b34a224d56.jpeg?auto=format&fit=crop&q=80"
        },
        {
            id: 5,
            name: "Mahakam Ulu",
            type: "Kabupaten",
            capital: "Ujoh Bilang",
            leader: "Angela Idang Belawan",
            area: "18.428",
            population: "34.740",
            density: "1,9",
            districts: 5,
            villages: "0/50",
            coordinates: { lat: 0.9997, lng: 114.4994 },
            destinations: ["Batu Dinding", "Air Terjun Kohong", "Riam Udang", "Desa Wisata Long Apari"],
            imageUrl: "https://infobenua.com/wp-content/uploads/2024/12/IMG-20241204-WA0054.jpg?auto=format&fit=crop&q=80"
        }
        // Truncated for brevity, but enough for prototype
    ];

    const EVENTS = [
        {
            id: 'e1',
            title: 'Festival Erau Adat Kutai Kartanegara',
            location: 'Tenggarong, Kutai Kartanegara',
            date: '15 - 22 Juli 2026',
            description: 'Perayaan budaya terbesar Kesultanan Kutai Kartanegara Ing Martadipura. Saksikan ritual sakral mendirikan Ayu hingga Belimbur.',
            imageUrl: 'https://images.unsplash.com/photo-1605218427360-3638d1a151e9?auto=format&fit=crop&q=80',
            category: 'Culture',
            tags: ['Royal Tradition', 'Cultural Parade', 'Folk Art'],
            price: 'Free',
            organizer: 'Dispar Kukar',
            ticketCount: 5000,
            schedule: [
                { time: '08:00', activity: 'Ritual Mendirikan Ayu' },
                { time: '10:00', activity: 'Parade Budaya Internasional' },
                { time: '14:00', activity: 'Lomba Olahraga Tradisional' },
                { time: '19:00', activity: 'Panggung Hiburan Rakyat' }
            ],
            gallery: [
                'https://images.unsplash.com/photo-1596401057633-565652b5d249?auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1518531933037-91b2f5d2294c?auto=format&fit=crop&q=80'
            ]
        },
        {
            id: 'e2',
            title: 'Derawan Eco-Marathon & Cleaning Day',
            location: 'Kepulauan Derawan, Berau',
            date: '10 Agustus 2026',
            description: 'Lari maraton di pinggir pantai sambil berpartisipasi dalam aksi bersih pantai dan pelepasan tukik bersama komunitas lokal.',
            imageUrl: 'https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?auto=format&fit=crop&q=80',
            category: 'Sustainability',
            tags: ['Sport Tourism', 'Conservation', 'Beach Clean-up'],
            price: 'Rp 250.000',
            organizer: 'Berau Coal & WWF',
            ticketCount: 500,
            schedule: [
                { time: '05:30', activity: 'Start Marathon 10K' },
                { time: '09:00', activity: 'Beach Clean-up Action' },
                { time: '11:00', activity: 'Pelepasan Tukik (Bayi Penyu)' },
                { time: '13:00', activity: 'Makan siang Seafood Bakar' }
            ]
        }
    ];

    const PACKAGES = [
        {
            id: 'p1',
            title: 'Eksplorasi Hutan Wehea & Dayak Culture',
            duration: '4D3N',
            price: 3500000,
            location: 'Muara Wahau, Kutai Timur',
            rating: 4.8,
            ecoRating: 5,
            description: 'Petualangan masuk ke jantung hutan hujan tropis tertua, bertemu Orangutan liar, dan tinggal bersama suku Dayak Wehea.',
            imageUrl: 'https://hutanlindungwehea.id/wp-content/uploads/2021/11/2.-sejarah-lansakp-hutan-scaled.jpg?auto=format&fit=crop&q=80',
            facilities: ['Homestay Lokal', 'Guide Dayak', 'Makan Tradisional', 'Donasi Konservasi'],
        },
        {
            id: 'p2',
            title: 'Labuan Cermin & Whale Shark Ecotourism',
            duration: '3D2N',
            price: 2800000,
            location: 'Biduk-Biduk, Berau',
            rating: 4.9,
            ecoRating: 4,
            description: 'Berenang di danau dua rasa Labuan Cermin dan berinteraksi ramah dengan Hiu Paus di Talisayan.',
            imageUrl: 'https://images.unsplash.com/photo-1582967788606-a171f1080ca8?auto=format&fit=crop&q=80',
            facilities: ['Speedboat', 'Alat Snorkeling', 'Dokumentasi Underwater', 'Meals'],
        }
    ];

    const ITINERARY_DETAILS = [
        {
            id: 'i1',
            packageId: 'p1',
            title: 'Eksplorasi Hutan Wehea & Dayak Culture - 4D3N',
            badges: ['Eco-Friendly', 'Support Local', 'Nature'],
            days: [
                {
                    day: 1,
                    title: 'Kedatangan & Sambutan Adat',
                    activities: [
                        { time: '09:00', title: 'Penjemputan Bandara', description: 'Tiba di Bandara Berau/Samarinda, perjalanan darat menuju Muara Wahau.', type: 'Transport' },
                        { time: '15:00', title: 'Tiba di Desa Nehas Liah Bing', description: 'Disambut upacara adat Dayak Wehea dan check-in di Homestay warga.', type: 'Activity' },
                        { time: '19:00', title: 'Makan Malam Tradisional', description: 'Menikmati hidangan khas Dayak seperti Lemang dan Ikan Bakar.', type: 'Meal' },
                    ]
                },
                {
                    day: 2,
                    title: 'Trekking Hutan Lindung Wehea',
                    activities: [
                        { time: '05:00', title: 'Sunrise & Bird Watching', description: 'Melihat aktivitas burung Enggang di pagi hari.', type: 'Activity' },
                        { time: '08:00', title: 'Jungle Trekking', description: 'Menjelajahi hutan primer, identifikasi tanaman obat, dan mencari jejak satwa liar.', type: 'Activity' },
                        { time: '12:00', title: 'Makan Siang di Sungai', description: 'Piknik ramah lingkungan di pinggir sungai Wehea.', type: 'Meal' },
                    ]
                },
                {
                    day: 3,
                    title: 'Konservasi & Interaksi Budaya',
                    activities: [
                        { time: '09:00', title: 'Workshop Anyaman', description: 'Belajar menganyam rotan bersama ibu-ibu pengrajin lokal.', type: 'Activity' },
                        { time: '14:00', title: 'Penanaman Pohon', description: 'Program adopsi pohon ulin sebagai jejak positif wisatawan.', type: 'Activity' },
                    ]
                },
                {
                    day: 4,
                    title: 'Perpisahan',
                    activities: [
                        { time: '08:00', title: 'Sarapan & Check Out', description: 'Persiapan kembali ke bandara.', type: 'Meal' },
                        { time: '13:00', title: 'Drop Bandara', description: 'Tiba di bandara untuk penerbangan pulang.', type: 'Transport' },
                    ]
                }
            ]
        },
        {
            id: 'i2',
            packageId: 'p2',
            title: 'Labuan Cermin & Whale Shark Ecotourism - 3D2N',
            badges: ['Marine Life', 'Adventure', 'Snorkeling'],
            days: [
                {
                    day: 1,
                    title: 'Perjalanan ke Biduk-Biduk',
                    activities: [
                        { time: '10:00', title: 'Arrival Berau', description: 'Penjemputan di Bandara Kalimarau.', type: 'Transport' },
                        { time: '11:00', title: 'Road Trip to Biduk-Biduk', description: 'Perjalanan darat 6 jam dengan pemandangan hutan tropis.', type: 'Transport' },
                        { time: '18:00', title: 'Check-in Homestay', description: 'Istirahat di penginapan tepi pantai.', type: 'Activity' },
                    ]
                },
                {
                    day: 2,
                    title: 'Labuan Cermin & Kaniungan',
                    activities: [
                        { time: '08:00', title: 'Labuan Cermin', description: 'Berenang di danau dua rasa yang kristal.', type: 'Activity' },
                        { time: '13:00', title: 'Pulau Kaniungan', description: 'Snorkeling dan melihat penyu.', type: 'Activity' },
                    ]
                },
                {
                    day: 3,
                    title: 'Whale Shark Talisayan',
                    activities: [
                        { time: '05:00', title: 'Talisayan', description: 'Melihat Hiu Paus di bagan nelayan.', type: 'Activity' },
                        { time: '10:00', title: 'Return', description: 'Perjalanan kembali ke Berau.', type: 'Transport' },
                    ]
                }
            ]
        }
    ];

    const TESTIMONIALS = [
        {
            id: 't1',
            name: 'Sarah Wijaya',
            role: 'Travel Blogger',
            avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80',
            rating: 5,
            content: 'Pengalaman hutan Wehea sungguh magis. Guide lokal sangat berpengetahuan dan kita benar-benar belajar tentang konservasi.',
        },
        {
            id: 't2',
            name: 'Budi Santoso',
            role: 'Eco-Enthusiast',
            avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80',
            rating: 5,
            content: 'Trip Derawan terbersih yang pernah saya ikuti. Salut dengan komitmen BorneoTrip untuk zero waste.',
        }
    ];

    console.log('Seeding Regions...')
    for (const r of REGIONS) {
        await prisma.region.upsert({
            where: { id: r.id },
            update: {},
            create: {
                id: r.id,
                name: r.name,
                type: r.type,
                capital: r.capital,
                leader: r.leader,
                area: r.area,
                population: r.population,
                density: r.density,
                districts: r.districts,
                villages: r.villages,
                latitude: r.coordinates.lat,
                longitude: r.coordinates.lng,
                imageUrl: r.imageUrl,
                destinations: JSON.stringify(r.destinations)
            }
        })
    }

    console.log('Seeding Events...')
    for (const e of EVENTS) {
        // @ts-ignore - Mock data has localized objects, schema expects string
        const title = typeof e.title === 'object' ? e.title.id : e.title;
        // @ts-ignore
        const description = typeof e.description === 'object' ? e.description.id : e.description;

        await prisma.event.upsert({
            where: { id: e.id },
            update: {},
            create: {
                id: e.id,
                title: title as string,
                location: e.location,
                date: e.date,
                description: description as string,
                imageUrl: e.imageUrl,
                category: e.category,
                tags: JSON.stringify(e.tags),
                price: e.price,
                organizer: e.organizer,
                ticketCount: e.ticketCount,
                schedule: JSON.stringify(e.schedule),
                gallery: JSON.stringify(e.gallery)
            }
        })
    }

    console.log('Seeding Packages...')
    for (const p of PACKAGES) {
        // @ts-ignore
        const title = typeof p.title === 'object' ? p.title.id : p.title;
        // @ts-ignore
        const description = typeof p.description === 'object' ? p.description.id : p.description;

        await prisma.tourPackage.upsert({
            where: { id: p.id },
            update: {},
            create: {
                id: p.id,
                title: title as string,
                duration: p.duration,
                price: p.price,
                location: p.location,
                rating: p.rating,
                ecoRating: p.ecoRating,
                description: description as string,
                imageUrl: p.imageUrl,
                facilities: JSON.stringify(p.facilities)
            }
        })
    }

    console.log('Seeding Itineraries...')
    for (const i of ITINERARY_DETAILS) {
        // Check if package exists first to avoid foreign key errors (though we seeded them)
        await prisma.itineraryDetail.upsert({
            where: { packageId: i.packageId },
            update: {},
            create: {
                id: i.id,
                packageId: i.packageId,
                title: i.title,
                badges: JSON.stringify(i.badges),
                days: JSON.stringify(i.days)
            }
        })
    }

    console.log('Seeding Testimonials...')
    for (const t of TESTIMONIALS) {
        await prisma.testimonial.upsert({
            where: { id: t.id },
            update: {},
            create: {
                id: t.id,
                name: t.name,
                role: t.role,
                avatarUrl: t.avatarUrl,
                rating: t.rating,
                content: t.content
            }
        })
    }

    console.log('Seeding Completed.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
