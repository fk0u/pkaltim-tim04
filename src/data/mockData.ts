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
    title: 'Festival Erau Adat Kutai Kartanegara',
    location: 'Tenggarong, Kutai Kartanegara',
    date: '15 - 22 Juli 2026',
    description: 'Perayaan budaya terbesar Kesultanan Kutai Kartanegara Ing Martadipura. Saksikan ritual sakral mendirikan Ayu hingga Belimbur.',
    imageUrl: 'https://images.unsplash.com/photo-1605218427360-3638d1a151e9?auto=format&fit=crop&q=80',
    category: 'Culture',
    tags: ['Royal Tradition', 'Cultural Parade', 'Folk Art'],
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
  },
  {
    id: 'e3',
    title: 'Mahakam Jazz Fiesta',
    location: 'Tepian Sungai Mahakam, Samarinda',
    date: '5 September 2026',
    description: 'Menikmati musik jazz internasional dengan latar belakang keindahan Sungai Mahakam saat senja.',
    imageUrl: 'https://images.unsplash.com/photo-1514525253440-b393452e8d26?auto=format&fit=crop&q=80',
    category: 'Nature',
    tags: ['Music', 'River View', 'Night Market'],
  },
];

export const PACKAGES: TourPackage[] = [
  {
    id: 'p1',
    title: 'Eksplorasi Hutan Wehea & Dayak Culture',
    duration: '4D3N',
    price: 3500000,
    location: 'Muara Wahau, Kutai Timur',
    ecoRating: 5,
    description: 'Petualangan masuk ke jantung hutan hujan tropis tertua, bertemu Orangutan liar, dan tinggal bersama suku Dayak Wehea.',
    imageUrl: 'https://images.unsplash.com/photo-1518182170546-0766ce6fdd93?auto=format&fit=crop&q=80',
    facilities: ['Homestay Lokal', 'Guide Dayak', 'Makan Tradisional', 'Donasi Konservasi'],
  },
  {
    id: 'p2',
    title: 'Labuan Cermin & Whale Shark Ecotourism',
    duration: '3D2N',
    price: 2800000,
    location: 'Biduk-Biduk, Berau',
    ecoRating: 4,
    description: 'Berenang di danau dua rasa Labuan Cermin dan berinteraksi ramah dengan Hiu Paus di Talisayan.',
    imageUrl: 'https://images.unsplash.com/photo-1582967788606-a171f1080ca8?auto=format&fit=crop&q=80',
    facilities: ['Speedboat', 'Alat Snorkeling', 'Dokumentasi Underwater', 'Meals'],
  },
  {
    id: 'p3',
    title: 'Samarinda City & Mahakam River Cruise',
    duration: '2D1N',
    price: 1200000,
    location: 'Samarinda',
    ecoRating: 3,
    description: 'Wisata sejarah di Samarinda dan menyusuri sungai Mahakam dengan kapal wisata tradisional Pesut Etam.',
    imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80',
    facilities: ['Hotel Bintang 3', 'River Cruise Ticket', 'Pemandu Wisata', 'Dinner'],
  },
];

export const ITINERARY_DETAIL: ItineraryDetail = {
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
    }
  ]
};
