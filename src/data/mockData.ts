import { Event, TourPackage, ItineraryDetail, Testimonial } from '@/types';

export const DESTINATIONS = [
  'Derawan, Berau',
  'Kakaban, Berau',
  'Maratua, Berau',
  'Tenggarong, Kutai Kartanegara',
  'Balikpapan',
  'Samarinda',
  'Wehea, Kutai Timur',
  'Biduk-Biduk, Berau',
  'Samboja, Kutai Kartanegara'
];

export const REGIONS = [
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
    capital: "Tanah Grogot",
    leader: "Fahmi Fadli",
    area: "7.731",
    population: "289.750",
    density: "37,5",
    districts: 10,
    villages: "5/139",
    coordinates: { lat: -1.9054, lng: 116.1956 },
    destinations: ["Museum Sadurengas", "Kampung Warna Warni", "Air Terjun Doyam Seriam"],
    imageUrl: "https://space-kd.sgp1.cdn.digitaloceanspaces.com/pusaranmedia/lg/news-lg-1682580794.jpeg?auto=format&fit=crop&q=80"
  },
  {
    id: 7,
    name: "Penajam Paser Utara",
    type: "Kabupaten",
    capital: "Penajam",
    leader: "Mudyat Noor",
    area: "3.179",
    population: "400.030",
    density: "125,8",
    districts: 4,
    villages: "24/30",
    coordinates: { lat: -1.2583, lng: 116.7909 },
    destinations: ["Titik Nol IKN", "Pantai Tanjung Jumlai", "Ekowisata Mangrove Penajam"],
    imageUrl: "https://space-kd.sgp1.cdn.digitaloceanspaces.com/pusaranmedia/lg/news-lg-1682580794.jpeg?auto=format&fit=crop&q=80"
  },
  {
    id: 8,
    name: "Balikpapan",
    type: "Kota",
    capital: "-",
    leader: "Rahmad Mas'ud",
    area: "533",
    population: "725.440",
    density: "1.361",
    districts: 6,
    villages: "34/0",
    coordinates: { lat: -1.2379, lng: 116.8529 },
    destinations: ["Pantai Melawai", "Hutan Lindung Sungai Wain", "Kebun Raya Balikpapan", "Penangkaran Buaya Teritip"],
    imageUrl: "https://asset.kompas.com/crops/3JKbuAIurwWwDDKDe5bho1LtDKM=/0x82:1000x749/1200x800/data/photo/2023/03/04/6403706778e69.jpg?auto=format&fit=crop&q=80"
  },
  {
    id: 9,
    name: "Bontang",
    type: "Kota",
    capital: "-",
    leader: "Neni Moerniaeni",
    area: "510",
    population: "190.710",
    density: "374",
    districts: 3,
    villages: "15/0",
    coordinates: { lat: 0.1333, lng: 117.5000 },
    destinations: ["Bontang Kuala", "Pulau Beras Basah", "Taman Nasional Kutai", "Cafe Singapore"],
    imageUrl: "https://www.niaga.asia/wp-content/uploads/2023/10/9-pkt.png?auto=format&fit=crop&q=80"
  },
  {
    id: 10,
    name: "Samarinda",
    type: "Kota",
    capital: "-",
    leader: "Andi Harun",
    area: "717",
    population: "865.310",
    density: "1.207",
    districts: 10,
    villages: "59/0",
    coordinates: { lat: -0.5022, lng: 117.1536 },
    destinations: ["Islamic Center Samarinda", "Desa Pampang", "Sungai Mahakam", "Air Terjun Tanah Merah"],
    imageUrl: "https://ik.imagekit.io/tvlk/blog/2024/12/shutterstock_2371326515.jpg?auto=format&fit=crop&q=80"
  }
];

export const TESTIMONIALS: Testimonial[] = [
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
  },
  {
    id: 't3',
    name: 'Jessica Tan',
    role: 'Digital Nomad',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80',
    rating: 4,
    content: 'Platform yang sangat memudahkan mencari event budaya di Kaltim. Festival Erau kemarin luar biasa!',
  },
];

export const EVENTS: Event[] = [
  {
    id: 'e1',
    title: {
      id: 'Festival Erau Adat Kutai Kartanegara',
      en: 'Erau Kutai Kartanegara Cultural Festival'
    },
    location: 'Tenggarong, Kutai Kartanegara',
    date: '15 - 22 Juli 2026',
    description: {
      id: 'Perayaan budaya terbesar Kesultanan Kutai Kartanegara Ing Martadipura. Saksikan ritual sakral mendirikan Ayu hingga Belimbur.',
      en: 'The largest cultural celebration of the Kutai Kartanegara Ing Martadipura Sultanate. Witness sacred rituals from erecting Ayu to Belimbur.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1605218427360-3638d1a151e9?auto=format&fit=crop&q=80',
    category: 'Culture',
    tags: ['Royal Tradition', 'Cultural Parade', 'Folk Art'],
    price: 'Free',
    organizer: 'Dispar Kukar',
    ticketCount: 5000,
    quota: 5000,
    bookedCount: 1240,
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
    title: {
      id: 'Derawan Eco-Marathon & Cleaning Day',
      en: 'Derawan Eco-Marathon & Cleaning Day'
    },
    location: 'Kepulauan Derawan, Berau',
    date: '10 Agustus 2026',
    description: {
      id: 'Lari maraton di pinggir pantai sambil berpartisipasi dalam aksi bersih pantai dan pelepasan tukik bersama komunitas lokal.',
      en: 'A beachside marathon while participating in beach cleanup actions and hatchling release with the local community.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?auto=format&fit=crop&q=80',
    category: 'Sustainability',
    tags: ['Sport Tourism', 'Conservation', 'Beach Clean-up'],
    price: 'Rp 250.000',
    organizer: 'Berau Coal & WWF',
    ticketCount: 500,
    quota: 500,
    bookedCount: 420,
    schedule: [
      { time: '05:30', activity: 'Start Marathon 10K' },
      { time: '09:00', activity: 'Beach Clean-up Action' },
      { time: '11:00', activity: 'Pelepasan Tukik (Bayi Penyu)' },
      { time: '13:00', activity: 'Makan siang Seafood Bakar' }
    ]
  },
  {
    id: 'e3',
    title: {
      id: 'Mahakam Jazz Fiesta',
      en: 'Mahakam Jazz Fiesta'
    },
    location: 'Tepian Sungai Mahakam, Samarinda',
    date: '5 September 2026',
    description: {
      id: 'Menikmati musik jazz internasional dengan latar belakang keindahan Sungai Mahakam saat senja.',
      en: 'Enjoy international jazz music against the backdrop of the beautiful Mahakam River at twilight.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1514525253440-b393452e8d26?auto=format&fit=crop&q=80',
    category: 'Nature',
    tags: ['Music', 'River View', 'Night Market'],
    price: 'Rp 150.000',
    priceChild: 100000,
    organizer: 'Samarinda Jazz Community',
    quota: 1000,
    bookedCount: 850,
    schedule: [
      { time: '16:00', activity: 'Open Gate & Bazaar Kuliner' },
      { time: '17:00', activity: 'Local Band Opening' },
      { time: '19:30', activity: 'Main Guest Star: Indra Lesmana' },
      { time: '22:00', activity: 'Jamming Session' }
    ]
  },
  {
    id: 'e4',
    title: {
      id: 'Festival Mahakam',
      en: 'Mahakam River Festival'
    },
    location: 'Sungai Mahakam, Samarinda',
    date: '1 - 3 November 2026',
    description: {
      id: 'Festival sungai terbesar dengan berbagai lomba perahu naga, berenang menyeberangi sungai, dan kuliner khas.',
      en: 'The largest river festival featuring dragon boat races, river swimming competitions, and local culinary delights.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80',
    category: 'Culture',
    tags: ['River Festival', 'Traditional Boat', 'Culinary'],
    price: 'Free',
    schedule: [
      { time: '08:00', activity: 'Lomba Perahu Naga' },
      { time: '13:00', activity: 'Lomba Berenang Menyeberangi Sungai' },
      { time: '16:00', activity: 'Parade Kapal Hias' }
    ]
  },
  {
    id: 'e5',
    title: {
      id: 'Balikpapan Fest',
      en: 'Balikpapan Fest'
    },
    location: 'BSCC Dome, Balikpapan',
    date: '20 Oktober 2026',
    description: {
      id: 'Pameran ekonomi kreatif, fashion show batik Kaltim, dan konser musik dalam rangka HUT Kota Balikpapan.',
      en: 'Creative economy exhibition, Kaltim batik fashion show, and music concert celebrating Balikpapan City Anniversary.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80',
    category: 'Culinary',
    tags: ['Creative Economy', 'Fashion', 'Concert'],
    price: 'Rp 50.000',
    schedule: [
      { time: '10:00', activity: 'Opening Creative Expo' },
      { time: '15:00', activity: 'Kaltim Fashion Show Runway' },
      { time: '20:00', activity: 'Music Concert: Tulus' }
    ]
  },
];

export const PACKAGES: TourPackage[] = [
  {
    id: 'p1',
    title: {
      id: 'Eksplorasi Hutan Wehea & Dayak Culture',
      en: 'Wehea Forest Exploration & Dayak Culture'
    },
    duration: '4D3N',
    price: 3500000,
    quota: 20,
    bookedCount: 8,
    location: 'Muara Wahau, Kutai Timur',
    rating: 4.8,
    ecoRating: 5,
    description: {
      id: 'Petualangan masuk ke jantung hutan hujan tropis tertua, bertemu Orangutan liar, dan tinggal bersama suku Dayak Wehea.',
      en: 'Adventure deep into the oldest rainforest hearth, observe wild Orangutans, and stay with the Dayak Wehea tribe.'
    },
    imageUrl: 'https://hutanlindungwehea.id/wp-content/uploads/2021/11/2.-sejarah-lansakp-hutan-scaled.jpg?auto=format&fit=crop&q=80',
    facilities: ['Homestay Lokal', 'Guide Dayak', 'Makan Tradisional', 'Donasi Konservasi'],
  },
  {
    id: 'p2',
    title: {
      id: 'Labuan Cermin & Whale Shark Ecotourism',
      en: 'Labuan Cermin & Whale Shark Ecotourism'
    },
    duration: '3D2N',
    price: 2800000,
    priceChild: 1800000,
    quota: 15,
    bookedCount: 12,
    location: 'Biduk-Biduk, Berau',
    rating: 4.9,
    ecoRating: 4,
    description: {
      id: 'Berenang di danau dua rasa Labuan Cermin dan berinteraksi ramah dengan Hiu Paus di Talisayan.',
      en: 'Swim in the dual-flavored Lake Labuan Cermin and interact sustainably with Whale Sharks in Talisayan.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1582967788606-a171f1080ca8?auto=format&fit=crop&q=80',
    facilities: ['Speedboat', 'Alat Snorkeling', 'Dokumentasi Underwater', 'Meals'],
  },
  {
    id: 'p3',
    title: {
      id: 'Samarinda City & Mahakam River Cruise',
      en: 'Samarinda City & Mahakam River Cruise'
    },
    duration: '2D1N',
    price: 1200000,
    priceChild: 800000,
    quota: 30,
    bookedCount: 5,
    location: 'Samarinda',
    rating: 4.5,
    ecoRating: 3,
    description: {
      id: 'Wisata sejarah di Samarinda dan menyusuri sungai Mahakam dengan kapal wisata tradisional Pesut Etam.',
      en: 'Historical tour of Samarinda and cruise along the Mahakam River on the traditional Pesut Etam scenic boat.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80',
    facilities: ['Hotel Bintang 3', 'River Cruise Ticket', 'Pemandu Wisata', 'Dinner'],
  },
  {
    id: 'p4',
    title: {
      id: 'Samboja Lodge Orangutan Experience',
      en: 'Samboja Lodge Orangutan Experience'
    },
    duration: '2D1N',
    price: 1800000,
    priceChild: 1200000,
    quota: 10,
    bookedCount: 2,
    location: 'Samboja, Kutai Kartanegara',
    rating: 4.7,
    ecoRating: 5,
    description: {
      id: 'Menginap di lodge eksklusif di tengah hutan rehabilitasi Orangutan BOS Foundation.',
      en: 'Stay at an exclusive lodge in the middle of the BOS Foundation Orangutan rehabilitation forest.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1599540209228-468ae39e2468?auto=format&fit=crop&q=80',
    facilities: ['Ecolodge Stay', 'Orangutan Feeding', 'Forest School', 'Vegetarian Meals'],
  },
  {
    id: 'p5',
    title: {
      id: 'Maratua Paradise Luxury Escape',
      en: 'Maratua Paradise Luxury Escape'
    },
    duration: '4D3N',
    price: 5500000,
    location: 'Maratua, Berau',
    rating: 5.0,
    ecoRating: 4,
    description: {
      id: 'Liburan mewah di resort atas air Maratua dengan akses langsung ke spot diving kelas dunia.',
      en: 'Luxury vacation at Maratua overwater resort with direct access to world-class diving spots.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&q=80',
    facilities: ['Water Villa', 'Diving Gear', 'Speedboat Transfer', 'Full Board Meals'],
  },
];

export const ITINERARY_DETAILS: ItineraryDetail[] = [
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
  },
  {
    id: 'i3',
    packageId: 'p3',
    title: 'Samarinda City & Mahakam River Cruise - 2D1N',
    badges: ['Culture', 'History', 'City Tour'],
    days: [
      {
        day: 1,
        title: 'City Tour Samarinda',
        activities: [
          { time: '09:00', title: 'Islamic Center', description: 'Mengunjungi masjid terbesar di Asia Tenggara.', type: 'Activity' },
          { time: '16:00', title: 'Mahakam River Cruise', description: 'Susur sungai Mahakam saat sunset dengan kapal pesut.', type: 'Activity' },
          { time: '19:00', title: 'Kuliner Tepian', description: 'Makan malam seafood di tepian Mahakam.', type: 'Meal' },
        ]
      },
      {
        day: 2,
        title: 'Budaya Pampang',
        activities: [
          { time: '09:00', title: 'Desa Budaya Pampang', description: 'Melihat tarian adat Dayak Kenyah (Hari Minggu).', type: 'Activity' },
          { time: '13:00', title: 'Souvenir Shopping', description: 'Belanja oleh-oleh khas Kaltim di Citra Niaga.', type: 'Activity' },
        ]
      }
    ]
  },
  {
    id: 'i4',
    packageId: 'p4',
    title: 'Samboja Lodge Orangutan Experience - 2D1N',
    badges: ['Conservation', 'Wildlife', 'Exclusive'],
    days: [
      {
        day: 1,
        title: 'Welcome to Samboja',
        activities: [
          { time: '10:00', title: 'Check-in Lodge', description: 'Tiba di Samboja Lodge yang asri.', type: 'Activity' },
          { time: '15:00', title: 'Island Tour', description: 'Melihat orangutan di pulau buatan pra-pelepasliaran.', type: 'Activity' },
        ]
      },
      {
        day: 2,
        title: 'Sun Bear Sanctuary',
        activities: [
          { time: '08:00', title: 'Suaka Beruang Madu', description: 'Mengunjungi pusat rehabilitasi beruang madu.', type: 'Activity' },
          { time: '11:00', title: 'Forest Walk', description: 'Jalan santai di hutan sekitar lodge.', type: 'Activity' },
        ]
      }
    ]
  },
  {
    id: 'i5',
    packageId: 'p5',
    title: 'Maratua Paradise Luxury Escape - 4D3N',
    badges: ['Luxury', 'Diving', 'Honeymoon'],
    days: [
      {
        day: 1,
        title: 'Arrival Paradise',
        activities: [
          { time: '14:00', title: 'Speedboat Transfer', description: 'Menyeberang dari Berau/Tarakan ke Maratua.', type: 'Transport' },
          { time: '16:00', title: 'Check-in Water Villa', description: 'Menikmati villa di atas air.', type: 'Activity' },
        ]
      },
      {
        day: 2,
        title: 'Kakaban & Sangalaki',
        activities: [
          { time: '08:00', title: 'Jellyfish Lake', description: 'Berenang dengan ubur-ubur tak menyengat di Kakaban.', type: 'Activity' },
          { time: '13:00', title: 'Manta Point', description: 'Diving/Snorkeling melihat Manta Ray di Sangalaki.', type: 'Activity' },
        ]
      },
      {
        day: 3,
        title: 'Maratua Exploration',
        activities: [
          { time: '09:00', title: 'Gua Halo Tabung', description: 'Berenang di gua air payau yang eksotis.', type: 'Activity' },
          { time: '16:00', title: 'Sunset at Pier', description: 'Menikmati sunset.', type: 'Activity' },
        ]
      },
      {
        day: 4,
        title: 'Departure',
        activities: [
          { time: '09:00', title: 'Check Out', description: 'Kembali ke daratan utama.', type: 'Transport' },
        ]
      }
    ]
  }
];

export const MOCK_USERS: any[] = [
  {
    id: 'u1',
    name: 'Admin User',
    email: 'admin@borneotrip.com',
    role: 'Admin',
    joinDate: '2023-01-01',
    avatar: 'https://i.pravatar.cc/150?u=admin',
    totalSpent: 0,
    status: 'Active'
  },
  {
    id: 'u2',
    name: 'Budi Santoso',
    email: 'budi.santoso@gmail.com',
    role: 'Customer',
    joinDate: '2023-05-15',
    avatar: 'https://i.pravatar.cc/150?u=budi',
    totalSpent: 4500000,
    status: 'Active'
  },
  {
    id: 'u3',
    name: 'John Smith',
    email: 'john.smith@example.com',
    role: 'Customer',
    joinDate: '2023-06-20',
    avatar: 'https://i.pravatar.cc/150?u=john',
    totalSpent: 8900000,
    status: 'Active'
  },
  {
    id: 'u4',
    name: 'Siti Aminah',
    email: 'siti.aminah@yahoo.com',
    role: 'Customer',
    joinDate: '2023-08-10',
    avatar: 'https://i.pravatar.cc/150?u=siti',
    totalSpent: 1200000,
    status: 'Inactive'
  },
  {
    id: 'u5',
    name: 'David Wilson',
    email: 'david.w@corp.net',
    role: 'Customer',
    joinDate: '2023-11-05',
    avatar: 'https://i.pravatar.cc/150?u=david',
    totalSpent: 5500000,
    status: 'Active'
  }
];

export const MOCK_BOOKINGS: any[] = [
  {
    id: 'b101',
    userId: 'u2',
    productId: 'p1',
    productType: 'Package',
    productName: 'Eksplorasi Hutan Wehea',
    date: '2023-08-15',
    amount: 3500000,
    status: 'Completed',
    paymentMethod: 'Bank Transfer',
    customerName: 'Budi Santoso'
  },
  {
    id: 'b102',
    userId: 'u3',
    productId: 'i5', // Linking to Maratua
    productType: 'Package',
    productName: 'Maratua Paradise Luxury',
    date: '2023-09-01',
    amount: 5500000,
    status: 'Paid',
    paymentMethod: 'Credit Card',
    customerName: 'John Smith'
  },
  {
    id: 'b103',
    userId: 'u4',
    productId: 'p3',
    productType: 'Package',
    productName: 'Samarinda City Tour',
    date: '2023-09-10',
    amount: 1200000,
    status: 'Completed',
    paymentMethod: 'E-Wallet',
    customerName: 'Siti Aminah'
  },
  {
    id: 'b104',
    userId: 'u2',
    productId: 'e2',
    productType: 'Event',
    productName: 'Derawan Eco-Marathon',
    date: '2023-09-25',
    amount: 1000000, // 4 tickets
    status: 'Pending',
    paymentMethod: 'Bank Transfer',
    customerName: 'Budi Santoso'
  },
  {
    id: 'b105',
    userId: 'u5',
    productId: 'p5',
    productType: 'Package',
    productName: 'Maratua Paradise Luxury',
    date: '2023-10-05',
    amount: 5500000,
    status: 'Paid',
    paymentMethod: 'Credit Card',
    customerName: 'David Wilson'
  },
  {
    id: 'b106',
    userId: 'u3',
    productId: 'p2',
    productType: 'Package',
    productName: 'Labuan Cermin & Whale Shark',
    date: '2023-10-20',
    amount: 2800000,
    status: 'Cancelled',
    paymentMethod: 'Credit Card',
    customerName: 'John Smith'
  },
  {
    id: 'b107',
    userId: 'u5',
    productId: 'e3',
    productType: 'Event',
    productName: 'Mahakam Jazz Fiesta',
    date: '2024-01-15',
    amount: 600000, // 4 tickets
    status: 'Pending', // Newest
    paymentMethod: 'E-Wallet',
    customerName: 'David Wilson'
  }
];
