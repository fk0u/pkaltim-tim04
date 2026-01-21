import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
})

async function main() {
  // Passwords
  const start = Date.now();
  console.log('Start seeding ...')

  const adminPassword = await bcrypt.hash('admin123', 10)
  const mitraPassword = await bcrypt.hash('mitra123', 10)
  const userPassword = await bcrypt.hash('user123', 10)
  
  // 1. Users
  console.log('Seeding Users...')
  await prisma.user.upsert({
    where: { email: 'admin@borneotrip.id' },
    update: {},
    create: {
      email: 'admin@borneotrip.id',
      name: 'Super Admin',
      password: adminPassword,
      role: 'admin',
      onboardingCompleted: true,
      preferences: JSON.stringify({ interests: ['all'], budget: 'unlimited', travelStyle: 'luxury' })
    }
  })

  await prisma.user.upsert({
    where: { email: 'mitra@borneotrip.id' },
    update: {},
    create: {
      email: 'mitra@borneotrip.id',
      name: 'Mitra Borneo',
      password: mitraPassword,
      role: 'mitra',
      onboardingCompleted: true,
      preferences: JSON.stringify({ interests: ['nature'], budget: 'medium', travelStyle: 'backpacker' })
    }
  })

  await prisma.user.upsert({
    where: { email: 'user@borneotrip.id' },
    update: {},
    create: {
      email: 'user@borneotrip.id',
      name: 'John Traveler',
      password: userPassword,
      role: 'client',
      onboardingCompleted: true,
      preferences: JSON.stringify({ interests: ['culture', 'food'], budget: 'medium', travelStyle: 'family' })
    }
  })

  // 2. Regions
  console.log('Seeding Regions...')
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
    },
    {
        id: 6,
        name: "Paser",
        type: "Kabupaten",
        capital: "Tana Paser",
        leader: "dr. Fahmi Fadli",
        area: "11.603",
        population: "275.452",
        density: "23,7",
        districts: 10,
        villages: "5/139",
        coordinates: { lat: -1.9167, lng: 116.2000 },
        destinations: ["Museum Sadurengas", "Pantai Pasir Mayang", "Air Terjun Doyam Seriam"],
        imageUrl: "https://kaltimtoday.co/wp-content/uploads/2021/08/Museum-Sadurengas-Paser.jpg"
    },
    {
        id: 7,
        name: "Penajam Paser Utara",
        type: "Kabupaten",
        capital: "Penajam",
        leader: "Makmur Marbun",
        area: "3.333",
        population: "183.187",
        density: "54,9",
        districts: 4,
        villages: "24/30",
        coordinates: { lat: -1.3000, lng: 116.7167 },
        destinations: ["Titik Nol IKN", "Pantai Tanjung Jumlai", "Ekowisata Mangrove Penajam"],
        imageUrl: "https://assets.promediateknologi.id/crop/0x0:0x0/x/photo/2022/02/16/2261775765.jpg"
    },
    {
        id: 8,
        name: "Balikpapan",
        type: "Kota",
        capital: "-",
        leader: "Rahmad Mas'ud",
        area: "527",
        population: "738.532",
        density: "1.401,3",
        districts: 6,
        villages: "34/0",
        coordinates: { lat: -1.2379, lng: 116.8529 },
        destinations: ["Pantai Lamaru", "Kebun Raya Balikpapan", "Hutan Lindung Sungai Wain"],
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Balikpapan_Skyline.jpg"
    },
    {
        id: 9,
        name: "Bontang",
        type: "Kota",
        capital: "-",
        leader: "Basri Rase",
        area: "158",
        population: "187.956",
        density: "1.189,6",
        districts: 3,
        villages: "15/0",
        coordinates: { lat: 0.1333, lng: 117.5000 },
        destinations: ["Bontang Kuala", "Pulau Beras Basah", "Taman Nasional Kutai"],
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Bontang_Kuala_Village.jpg"
    },
    {
        id: 10,
        name: "Samarinda",
        type: "Kota",
        capital: "-",
        leader: "Andi Harun",
        area: "783",
        population: "834.824",
        density: "1.066,2",
        districts: 10,
        villages: "59/0",
        coordinates: { lat: -0.5022, lng: 117.1536 },
        destinations: ["Islamic Center Samarinda", "Desa Budaya Pampang", "Sungai Mahakam"],
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Islamic_Center_Samarinda_Mosque.jpg/1200px-Islamic_Center_Samarinda_Mosque.jpg"
    }
  ];

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

  // 3. Events
  console.log('Seeding Events...')
  const EVENTS = [
    {
      id: 'e1',
      title: 'Festival Erau Adat Kutai Kartanegara',
      location: 'Tenggarong, Kutai Kartanegara',
      date: '15 - 22 Juli 2026',
      description: 'Perayaan budaya terbesar Kesultanan Kutai Kartanegara Ing Martadipura.',
      imageUrl: 'https://images.unsplash.com/photo-1605218427360-3638d1a151e9?auto=format&fit=crop&q=80',
      category: 'Culture',
      tags: ['Royal Tradition', 'Cultural Parade', 'Folk Art'],
      price: 'Free',
      organizer: 'Dispar Kukar',
      ticketCount: 5000,
      schedule: [
        { time: '08:00', activity: 'Ritual Mendirikan Ayu' },
        { time: '10:00', activity: 'Parade Budaya Internasional' },
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
      description: 'Lari maraton di pinggir pantai sambil berpartisipasi dalam aksi bersih pantai.',
      imageUrl: 'https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?auto=format&fit=crop&q=80',
      category: 'Sustainability',
      tags: ['Sport Tourism', 'Conservation', 'Beach Clean-up'],
      price: 'Rp 250.000',
      organizer: 'Berau Coal & WWF',
      ticketCount: 500,
      schedule: [
        { time: '05:30', activity: 'Start Marathon 10K' },
        { time: '09:00', activity: 'Beach Clean-up Action' }
      ]
    },
    {
        id: 'e3',
        title: 'Balikpapan Jazz Festival',
        location: 'Pantai Kilang Mandiri, Balikpapan',
        date: '5 September 2026',
        description: 'Festival musik jazz tahunan dengan latar belakang sunset pantai Balikpapan.',
        imageUrl: 'https://images.unsplash.com/photo-1514525253440-b393452e2729?auto=format&fit=crop&q=80',
        category: 'Entertainment',
        tags: ['Music', 'Jazz', 'Sunset'],
        price: 'Rp 150.000',
        organizer: 'Bekraf & Pemkot Balikpapan',
        ticketCount: 3000,
        schedule: [
            { time: '16:00', activity: 'Open Gate' },
            { time: '17:00', activity: 'Opening Act' },
            { time: '20:00', activity: 'Main Performance' }
        ]
    }
  ];

  for (const e of EVENTS) {
      await prisma.event.upsert({
          where: { id: e.id },
          update: {},
          create: {
              id: e.id,
              title: e.title,
              location: e.location,
              date: e.date,
              description: e.description,
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

  // 4. Packages & Itineraries
  console.log('Seeding Packages...')
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
    },
    {
        id: 'p3',
        title: 'Susur Sungai Mahakam & Pesut Spotting',
        duration: '2D1N',
        price: 1200000,
        location: 'Kutai Kartanegara',
        rating: 4.5,
        ecoRating: 4,
        description: 'Menyusuri sungai legendaris Mahakam dengan kapal wisata, melihat kehidupan tepian sungai dan mencari Pesut Mahakam.',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Mahakam_River_Samarinda.jpg',
        facilities: ['Kapal Wisata', 'Makan Siang', 'Guide'],
    }
  ];

  for (const p of PACKAGES) {
      await prisma.tourPackage.upsert({
          where: { id: p.id },
          update: {},
          create: {
              id: p.id,
              title: p.title,
              duration: p.duration,
              price: p.price,
              location: p.location,
              rating: p.rating,
              ecoRating: p.ecoRating,
              description: p.description,
              imageUrl: p.imageUrl,
              facilities: JSON.stringify(p.facilities)
          }
      })
  }

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
            { time: '15:00', title: 'Tiba di Desa Nehas Liah Bing', description: 'Disambut upacara adat Dayak Wehea.', type: 'Activity' },
          ]
        },
        {
          day: 2,
          title: 'Trekking Hutan Lindung Wehea',
          activities: [
            { time: '08:00', title: 'Jungle Trekking', description: 'Menjelajahi hutan primer.', type: 'Activity' },
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
            { time: '11:00', title: 'Road Trip', description: 'Perjalanan darat 6 jam.', type: 'Transport' },
          ]
        }
      ]
    },
    {
        id: 'i3',
        packageId: 'p3',
        title: 'Susur Sungai Mahakam - 2D1N',
        badges: ['River Cruise', 'Relaxing', 'Wildlife'],
        days: [
            {
                day: 1,
                title: 'River Cruise',
                activities: [
                    { time: '16:00', title: 'Start Cruise', description: 'Berangkat dari pelabuhan kapal wisata.', type: 'Transport' }
                ]
            }
        ]
    }
  ];

  for (const i of ITINERARY_DETAILS) {
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

  // 5. Testimonials
  const TESTIMONIALS = [
    {
      id: 't1',
      name: 'Sarah Wijaya',
      role: 'Travel Blogger',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80',
      rating: 5,
      content: 'Pengalaman hutan Wehea sungguh magis. Guide lokal sangat berpengetahuan.',
    }
  ];

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

  console.log(`Seeding finished in ${Date.now() - start}ms`)
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
