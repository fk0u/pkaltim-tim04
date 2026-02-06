
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

// Helper: Use placeholder images that always work
const IMG = {
    // Categories
    nature: '/images/categories/nature.svg',
    marine: '/images/categories/marine.svg',
    culture: '/images/categories/culture.svg',
    urban: '/images/categories/urban.svg',
    culinary: '/images/categories/culinary.svg',
    // Packages - Marine & Islands
    derawan: '/images/packages/derawan.svg',
    maratua: '/images/packages/maratua.svg',
    sangalaki: '/images/packages/sangalaki.svg',
    pantaiAmal: '/images/packages/pantai-amal.svg',
    // Packages - Nature & Wildlife
    labuanCermin: '/images/packages/labuan-cermin.svg',
    wehea: '/images/packages/wehea.svg',
    kutaiNP: '/images/packages/kutai-np.svg',
    bukitSoeharto: '/images/packages/bukit-soeharto.svg',
    pesut: '/images/packages/pesut.svg',
    samboja: '/images/packages/samboja.svg',
    beratus: '/images/packages/beratus.svg',
    // Packages - Culture & Heritage
    mahakam: '/images/packages/mahakam.svg',
    longhouse: '/images/packages/longhouse.svg',
    tenggarong: '/images/packages/tenggarong.svg',
    // Packages - Modern & Urban
    ikn: '/images/packages/ikn.svg',
    bangkirai: '/images/packages/bangkirai.svg',
    tarakan: '/images/packages/tarakan.svg',
    // Packages - Culinary
    kuliner: '/images/packages/culinary.svg',
    // Events 2024-2025
    erau: '/images/events/erau.svg',
    inti: '/images/events/inti.svg',
    borneo: '/images/events/borneo-festival.svg',
    marineFest: '/images/events/marine-festival.svg',
    foodFest: '/images/events/food-festival.svg',
    jazzFest: '/images/events/jazz-festival.svg',
    dayakFest: '/images/events/dayak-festival.svg',
    marathon: '/images/events/marathon.svg',
    kancilRun: '/images/events/kancil-run.svg',
    mahakamMusic: '/images/events/mahakam-music.svg',
    greenRun: '/images/events/green-run.svg',
    capGoMeh: '/images/events/capgomeh.svg',
    // Events 2026
    borneoCultureWeek: '/images/events/borneo-culture-week.svg',
    balikpapanFest: '/images/events/balikpapan-fest.svg',
    folkloreFest: '/images/events/folklore-festival.svg',
    iknHutRi: '/images/events/ikn-hut-ri.svg',
    // Regions
    samarinda: '/images/regions/samarinda.svg',
    balikpapan: '/images/regions/balikpapan.svg',
    berau: '/images/regions/berau.svg',
    kukar: '/images/regions/kutai-kartanegara.svg',
    ppu: '/images/regions/ppu.svg',
    bontang: '/images/regions/bontang.svg',
};

async function main() {
    console.log('🌱 Starting database seed...');

    // --- Clean DB ---
    console.log('🧹 Cleaning existing data...');
    await prisma.message.deleteMany();
    await prisma.chatSession.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.paymentMethod.deleteMany();
    await prisma.address.deleteMany();
    await prisma.wishlist.deleteMany();
    await prisma.partnerProfile.deleteMany();
    await prisma.itineraryDetail.deleteMany();
    await prisma.event.deleteMany();
    await prisma.tourPackage.deleteMany();
    await prisma.testimonial.deleteMany();
    await prisma.user.deleteMany();
    await prisma.region.deleteMany();
    await prisma.category.deleteMany();

    // =============================================
    // CATEGORIES
    // =============================================
    console.log('🏷️ Creating Categories...');
    await prisma.category.createMany({
        data: [
            { name: { en: 'Nature & Wildlife', id: 'Alam & Satwa Liar' }, icon: '🌳', imageUrl: IMG.nature },
            { name: { en: 'Marine & Islands', id: 'Bahari & Kepulauan' }, icon: '🏝️', imageUrl: IMG.marine },
            { name: { en: 'Culture & Heritage', id: 'Budaya & Warisan' }, icon: '🎭', imageUrl: IMG.culture },
            { name: { en: 'Modern & Urban', id: 'Kota Modern' }, icon: '🏙️', imageUrl: IMG.urban },
            { name: { en: 'Culinary', id: 'Kuliner' }, icon: '🍽️', imageUrl: IMG.culinary }
        ]
    });

    // =============================================
    // REGIONS
    // =============================================
    console.log('🗺️ Creating Regions...');
    await prisma.region.createMany({
        data: [
            { name: 'Samarinda', type: 'Kota', capital: 'Samarinda', leader: 'Andi Harun', area: '718.00', population: '868,499', density: '1,210', districts: 10, villages: '59 Kelurahan', latitude: -0.5022, longitude: 117.1536, imageUrl: IMG.samarinda, destinations: ['Islamic Center Samarinda', 'Sungai Mahakam', 'Desa Budaya Pampang', 'Citra Niaga'] },
            { name: 'Balikpapan', type: 'Kota', capital: 'Balikpapan', leader: 'Rahmad Mas\'ud', area: '511.01', population: '757,418', density: '1,482', districts: 6, villages: '34 Kelurahan', latitude: -1.2379, longitude: 116.8529, imageUrl: IMG.balikpapan, destinations: ['Pantai Kemala', 'Bukit Bangkirai', 'Penangkaran Buaya', 'Manggar Beach'] },
            { name: 'Berau', type: 'Kabupaten', capital: 'Tanjung Redeb', leader: 'Sri Juniarsih Mas', area: '36,962.37', population: '299,005', density: '8', districts: 13, villages: '110 Desa/Kelurahan', latitude: 2.1500, longitude: 117.5000, imageUrl: IMG.berau, destinations: ['Kepulauan Derawan', 'Danau Labuan Cermin', 'Pulau Kakaban', 'Pulau Maratua'] },
            { name: 'Kutai Kartanegara', type: 'Kabupaten', capital: 'Tenggarong', leader: 'Edi Damansyah', area: '27,263.10', population: '789,767', density: '29', districts: 18, villages: '238 Desa/Kelurahan', latitude: -0.4000, longitude: 117.0000, imageUrl: IMG.kukar, destinations: ['Museum Mulawarman', 'Pulau Kumala', 'Ladaya Waterpark', 'Keraton Kutai'] },
            { name: 'Penajam Paser Utara', type: 'Kabupaten', capital: 'Penajam', leader: 'Abdul Gafur Mas\'ud', area: '3,333.06', population: '194,932', density: '58', districts: 4, villages: '54 Desa/Kelurahan', latitude: -1.3500, longitude: 116.5500, imageUrl: IMG.ppu, destinations: ['Titik Nol IKN Nusantara', 'Pantai Nipah-Nipah', 'Hutan Mangrove Mentawir'] },
            { name: 'Bontang', type: 'Kota', capital: 'Bontang', leader: 'Basri Rase', area: '161.88', population: '191,811', density: '1,185', districts: 3, villages: '15 Kelurahan', latitude: 0.1332, longitude: 117.5000, imageUrl: IMG.bontang, destinations: ['Taman Mangrove Bontang', 'Pulau Beras Basah', 'Taman Nasional Kutai'] }
        ]
    });

    // =============================================
    // USERS
    // =============================================
    console.log('👤 Creating Users...');
    const adminPassword = await hash('admin123', 10);
    const userPassword = await hash('password123', 10);

    const admin = await prisma.user.create({
        data: { name: 'Admin BorneoTrip', email: 'admin@borneotrip.id', password: adminPassword, role: 'admin', phone: '+6281234567890', onboardingCompleted: true }
    });

    const mitra = await prisma.user.create({
        data: { name: 'Derawan Paradise Tours', email: 'mitra@derawantours.com', password: userPassword, role: 'mitra', phone: '+6281345678901', onboardingCompleted: true, bio: 'Tour operator resmi Kepulauan Derawan dengan pengalaman 15+ tahun.' }
    });

    await prisma.user.create({
        data: { name: 'Budi Santoso', email: 'budi@gmail.com', password: userPassword, role: 'client', phone: '+6281456789012', onboardingCompleted: true, preferences: { interests: ['diving', 'culture', 'nature'], budget: 'medium', travelStyle: 'adventure' } }
    });

    // =============================================
    // TOUR PACKAGES - 12 PACKAGES (2-3 per category)
    // =============================================
    console.log('📦 Creating Tour Packages...');

    // ============ MARINE & ISLANDS (3) ============
    // 1. Derawan Island Hopping
    const derawanPkg = await prisma.tourPackage.create({
        data: {
            title: { id: 'Eksotis Derawan Island Hopping 4H3M', en: 'Exotic Derawan Island Hopping 4D3N' },
            description: { id: 'Jelajahi surga tersembunyi Kepulauan Derawan! Snorkeling dengan penyu hijau, berenang bersama ubur-ubur tanpa sengat di Kakaban, Manta Ray di Sangalaki. Akomodasi: Derawan Fisheries Resort (★★★).', en: 'Explore the hidden paradise of Derawan Islands! Snorkeling with green turtles, swimming with stingless jellyfish at Kakaban, Manta Rays at Sangalaki. Accommodation: Derawan Fisheries Resort (★★★).' },
            duration: '4 Hari 3 Malam', price: 3850000, priceChild: 2750000, location: 'Berau, Kalimantan Timur',
            category: 'Marine & Islands', rating: 4.9, ecoRating: 5, quota: 20, bookedCount: 156, imageUrl: IMG.derawan,
            facilities: ['Resort AC', 'Speedboat Charter', 'Full Meals (3x)', 'Snorkeling Gear', 'Guide Lokal', 'Dokumentasi', 'Asuransi'], status: 'approved'
        }
    });
    await prisma.itineraryDetail.create({
        data: {
            packageId: derawanPkg.id, title: 'Itinerary Derawan', badges: ['Snorkeling', 'Diving', 'Wildlife'], days: [
                { day: 1, title: 'Arrival & Exploration', activities: ['Bandara Kalimarau', 'Transfer Dermaga', 'Speedboat Derawan', 'Check-in', 'Snorkeling sore'] },
                { day: 2, title: 'Island Hopping', activities: ['Sangalaki Manta Point', 'Kakaban Ubur-ubur', 'Maratua Gua Haji Mangku'] },
                { day: 3, title: 'Turtle & Sunset', activities: ['Gusung Sanggalau', 'Turtle Traffic Point', 'Sunset Jetty', 'Penyu bertelur'] },
                { day: 4, title: 'Departure', activities: ['Breakfast', 'Check-out', 'Transfer Bandara'] }
            ]
        }
    });

    // 2. Maratua Paradise Dive
    const maratuaPkg = await prisma.tourPackage.create({
        data: {
            title: { id: 'Maratua Paradise Dive Trip 5H4M', en: 'Maratua Paradise Dive Trip 5D4N' },
            description: { id: 'Paket khusus penyelam bersertifikat! "Big Fish Country" Maratua: The Channel, Turtle Traffic, Barracuda Point. 10 boat dives + unlimited house reef. Akomodasi: Maratua Paradise Resort (Water Villa).', en: 'Special package for certified divers! Maratua\'s "Big Fish Country": The Channel, Turtle Traffic, Barracuda Point. 10 boat dives + unlimited house reef. Accommodation: Maratua Paradise Resort (Water Villa).' },
            duration: '5 Hari 4 Malam', price: 8500000, priceChild: 6000000, location: 'Maratua, Berau',
            category: 'Marine & Islands', rating: 4.9, ecoRating: 5, quota: 10, bookedCount: 98, imageUrl: IMG.maratua,
            facilities: ['Water Villa', '10x Boat Dives', 'Full Dive Gear', 'Nitrox', 'Full Meals', 'Dive Guide'], status: 'approved'
        }
    });
    await prisma.itineraryDetail.create({
        data: {
            packageId: maratuaPkg.id, title: 'Itinerary Maratua Dive', badges: ['Diving', 'Big Fish', 'Underwater'], days: [
                { day: 1, title: 'Arrival', activities: ['Arrival Kalimarau', 'Speedboat Maratua', 'Check-in', 'Check dive', 'Dinner'] },
                { day: 2, title: '3 Dives', activities: ['The Channel', 'Turtle Traffic', 'Barracuda Point', 'Night dive optional'] },
                { day: 3, title: '3 Dives', activities: ['Kakaban Wall', 'Sangalaki Manta', 'Jetty', 'Snorkeling Kakaban'] },
                { day: 4, title: '3 Dives', activities: ['Big Fish sites', 'Farewell dinner'] },
                { day: 5, title: 'Departure', activities: ['Breakfast', 'Speedboat', 'Transfer Bandara'] }
            ]
        }
    });

    // 3. Sangalaki Manta Adventure
    const sangalakiPkg = await prisma.tourPackage.create({
        data: {
            title: { id: 'Sangalaki Manta Adventure 3H2M', en: 'Sangalaki Manta Adventure 3D2N' },
            description: { id: 'Fokus pengamatan Manta Ray di Sangalaki! 3 kali snorkeling/diving di Manta Point, kunjungan penangkaran penyu, sunset di Derawan. Budget-friendly untuk backpacker.', en: 'Focus on Manta Ray observation at Sangalaki! 3 snorkeling/diving sessions at Manta Point, turtle hatchery visit, sunset at Derawan. Budget-friendly for backpackers.' },
            duration: '3 Hari 2 Malam', price: 2450000, priceChild: 1750000, location: 'Sangalaki, Berau',
            category: 'Marine & Islands', rating: 4.7, ecoRating: 5, quota: 15, bookedCount: 67, imageUrl: IMG.sangalaki,
            facilities: ['Homestay', 'Speedboat', 'Meals 2x', 'Snorkeling Gear', 'Guide', 'Life Jacket'], status: 'approved'
        }
    });
    await prisma.itineraryDetail.create({
        data: {
            packageId: sangalakiPkg.id, title: 'Itinerary Sangalaki', badges: ['Manta Ray', 'Snorkeling', 'Budget'], days: [
                { day: 1, title: 'Arrival', activities: ['Tanjung Batu', 'Speedboat Derawan', 'Check-in', 'Orientasi'] },
                { day: 2, title: 'Manta Day', activities: ['Manta Point AM', 'Penangkaran Penyu', 'Manta Point PM', 'Sunset Derawan'] },
                { day: 3, title: 'Departure', activities: ['Manta Point AM', 'Check-out', 'Transfer'] }
            ]
        }
    });

    // ============ NATURE & WILDLIFE (3) ============
    // 4. Labuan Cermin & Whale Shark
    const labuanPkg = await prisma.tourPackage.create({
        data: {
            title: { id: 'Labuan Cermin & Whale Shark 3H2M', en: 'Labuan Cermin & Whale Shark 3D2N' },
            description: { id: 'Danau dua rasa + berenang bersama Hiu Paus! Labuan Cermin (air tawar di atas, air asin di bawah), Whale Shark Point Talisayan (Seasonal: Maret-September). Akomodasi: Homestay lokal AC.', en: 'Two-flavor lake + swimming with Whale Sharks! Labuan Cermin (freshwater above, saltwater below), Whale Shark Point Talisayan (Seasonal: March-September). Accommodation: Local homestay with AC.' },
            duration: '3 Hari 2 Malam', price: 2950000, priceChild: 1950000, location: 'Biduk-Biduk, Berau',
            category: 'Nature & Wildlife', rating: 4.8, ecoRating: 5, quota: 12, bookedCount: 89, imageUrl: IMG.labuanCermin,
            facilities: ['Homestay AC', 'Perahu Motor', 'Full Meals', 'Snorkeling Gear', 'Life Jacket', 'Guide'], status: 'approved'
        }
    });
    await prisma.itineraryDetail.create({
        data: {
            packageId: labuanPkg.id, title: 'Itinerary Labuan Cermin', badges: ['Whale Shark', 'Snorkeling', 'Nature'], days: [
                { day: 1, title: 'Journey', activities: ['Meeting Tanjung Redeb', 'Drive Biduk-Biduk (4 jam)', 'Check-in', 'Sunset'] },
                { day: 2, title: 'Whale Shark', activities: ['Whale Shark Point', 'Lunch', 'Danau Labuan Cermin', 'Back homestay'] },
                { day: 3, title: 'Departure', activities: ['Air Terjun', 'Check-out', 'Return Tanjung Redeb'] }
            ]
        }
    });

    // 5. Wehea Rainforest Expedition
    const weheaPkg = await prisma.tourPackage.create({
        data: {
            title: { id: 'Ekspedisi Hutan Lindung Wehea 5H4M', en: 'Wehea Protected Forest Expedition 5D4N' },
            description: { id: 'Petualangan sejati ke jantung Kalimantan! Tracking Orangutan liar, Jungle Lodge, suku Dayak Wehea, air terjun tersembunyi, night safari. Level: Moderate-Challenging.', en: 'True adventure to Borneo\'s heart! Wild Orangutan tracking, Jungle Lodge, Dayak Wehea tribe, hidden waterfalls, night safari. Level: Moderate-Challenging.' },
            duration: '5 Hari 4 Malam', price: 5250000, priceChild: 3750000, location: 'Muara Wahau, Kutai Timur',
            category: 'Nature & Wildlife', rating: 5.0, ecoRating: 5, quota: 8, bookedCount: 42, imageUrl: IMG.wehea,
            facilities: ['Jungle Lodge', 'Transport 4WD', 'Full Meals', 'Ranger', 'Porter', 'Sleeping Bag', 'P3K'], status: 'approved'
        }
    });
    await prisma.itineraryDetail.create({
        data: {
            packageId: weheaPkg.id, title: 'Itinerary Wehea', badges: ['Orangutan', 'Trekking', 'Cultural'], days: [
                { day: 1, title: 'Journey', activities: ['Samarinda', 'Drive Muara Wahau (6 jam)', 'Check-in', 'Briefing'] },
                { day: 2, title: 'Into Jungle', activities: ['Enter Wehea', 'Trekking Lodge (4 jam)', 'Settling', 'Night walk'] },
                { day: 3, title: 'Orangutan', activities: ['Full day tracking', 'Lunch hutan', 'Continue tracking', 'Dinner'] },
                { day: 4, title: 'Waterfall', activities: ['Air Terjun', 'Desa Dayak Wehea', 'Pertunjukan budaya'] },
                { day: 5, title: 'Return', activities: ['Trek keluar', 'Drive Samarinda', 'Drop off'] }
            ]
        }
    });

    // 6. Kutai National Park Safari
    const kutaiPkg = await prisma.tourPackage.create({
        data: {
            title: { id: 'Safari Taman Nasional Kutai 3H2M', en: 'Kutai National Park Safari 3D2N' },
            description: { id: 'Safari hutan hujan tropis terbaik! Trekking melihat Orangutan, Bekantan, Beruang Madu, Sun Bear, Burung Rangkong. Stay di Sangkima Research Station. Kategori: Family-Friendly.', en: 'Best tropical rainforest safari! Trekking to see Orangutans, Proboscis Monkeys, Sun Bears, Hornbills. Stay at Sangkima Research Station. Category: Family-Friendly.' },
            duration: '3 Hari 2 Malam', price: 2150000, priceChild: 1450000, location: 'Bontang, Kalimantan Timur',
            category: 'Nature & Wildlife', rating: 4.6, ecoRating: 5, quota: 16, bookedCount: 78, imageUrl: IMG.kutaiNP,
            facilities: ['Research Station', 'Ranger Guide', 'Full Meals', 'Trekking Gear', 'Binoculars', 'Documentation'], status: 'approved'
        }
    });
    await prisma.itineraryDetail.create({
        data: {
            packageId: kutaiPkg.id, title: 'Itinerary Kutai NP', badges: ['Safari', 'Wildlife', 'Family'], days: [
                { day: 1, title: 'Arrival', activities: ['Balikpapan pickup', 'Drive Sangkima (3 jam)', 'Check-in', 'Evening walk'] },
                { day: 2, title: 'Safari Day', activities: ['Sunrise trek', 'Orangutan tracking', 'Lunch alam', 'Afternoon trek', 'Night sounds'] },
                { day: 3, title: 'Departure', activities: ['Morning birdwatching', 'Check-out', 'Drive Balikpapan'] }
            ]
        }
    });

    // ============ CULTURE & HERITAGE (3) ============
    // 7. Mahakam Cultural Cruise
    const mahakamPkg = await prisma.tourPackage.create({
        data: {
            title: { id: 'Mahakam River Cultural Cruise 4H3M', en: 'Mahakam River Cultural Cruise 4D3N' },
            description: { id: 'Susuri Sungai Mahakam dengan kapal tradisional! Desa Dayak Benuaq & Tunjung, tari tradisional, Pesut Mahakam, anggrek hitam, sunset spektakuler. Akomodasi: Kapal wisata AC.', en: 'Cruise Mahakam River by traditional houseboat! Dayak villages, traditional dances, Mahakam Dolphins, black orchids, spectacular sunset. Accommodation: AC tour boat.' },
            duration: '4 Hari 3 Malam', price: 4150000, priceChild: 2850000, location: 'Tenggarong - Muara Muntai',
            category: 'Culture & Heritage', rating: 4.6, ecoRating: 4, quota: 16, bookedCount: 67, imageUrl: IMG.mahakam,
            facilities: ['Kapal AC', 'Full Board Meals', 'Pertunjukan Budaya', 'Guide', 'Welcome Drink'], status: 'approved'
        }
    });
    await prisma.itineraryDetail.create({
        data: {
            packageId: mahakamPkg.id, title: 'Itinerary Mahakam', badges: ['River Cruise', 'Cultural', 'Dolphin'], days: [
                { day: 1, title: 'Boarding', activities: ['Transfer Tenggarong', 'Museum Mulawarman', 'Boarding kapal', 'Dinner on board'] },
                { day: 2, title: 'Village Visit', activities: ['Cruise Muara Muntai', 'Desa Mancong Rumah Lamin', 'Tari Dayak', 'Continue cruise'] },
                { day: 3, title: 'Dolphins', activities: ['Danau Semayang', 'Pesut Mahakam spotting', 'Desa Tanjung Isuy', 'Upacara adat'] },
                { day: 4, title: 'Return', activities: ['Cruise back', 'Pasar tradisional', 'Transfer Samarinda/Balikpapan'] }
            ]
        }
    });

    // 8. Dayak Longhouse Experience
    const longhousePkg = await prisma.tourPackage.create({
        data: {
            title: { id: 'Pengalaman Rumah Lamin Dayak 2H1M', en: 'Dayak Longhouse Experience 2D1N' },
            description: { id: 'Menginap di Rumah Lamin asli suku Dayak Benuaq! Belajar tenun ulap doyo, memasak makanan tradisional, pertunjukan tari Kancet, upacara adat Belian. Interaksi langsung dengan masyarakat Dayak.', en: 'Stay in authentic Dayak Benuaq Longhouse! Learn ulap doyo weaving, cook traditional food, Kancet dance performance, Belian ceremony. Direct interaction with Dayak community.' },
            duration: '2 Hari 1 Malam', price: 1650000, priceChild: 1100000, location: 'Muara Muntai, Kutai Kartanegara',
            category: 'Culture & Heritage', rating: 4.8, ecoRating: 4, quota: 12, bookedCount: 45, imageUrl: IMG.longhouse,
            facilities: ['Rumah Lamin Stay', 'Traditional Meals', 'Cultural Workshop', 'Dance Performance', 'Local Guide'], status: 'approved'
        }
    });
    await prisma.itineraryDetail.create({
        data: {
            packageId: longhousePkg.id, title: 'Itinerary Longhouse', badges: ['Cultural', 'Homestay', 'Traditional'], days: [
                { day: 1, title: 'Arrival', activities: ['Pickup Samarinda', 'Boat ke desa', 'Welcome ceremony', 'Lunch tradisional', 'Workshop tenun', 'Makan malam', 'Tari Kancet'] },
                { day: 2, title: 'Departure', activities: ['Sarapan tradisional', 'Jalan-jalan desa', 'Upacara perpisahan', 'Return Samarinda'] }
            ]
        }
    });

    // 9. Tenggarong Royal Heritage Tour
    const tenggarongPkg = await prisma.tourPackage.create({
        data: {
            title: { id: 'Wisata Warisan Kerajaan Tenggarong 1H', en: 'Tenggarong Royal Heritage Tour 1D' },
            description: { id: 'City tour Tenggarong dalam 1 hari! Keraton Kutai, Museum Mulawarman, Makam Sultan, Pulau Kumala, Pasar Tepian. Termasuk makan siang di restoran riverfront. Perfect untuk 1 day trip dari Samarinda.', en: 'Tenggarong city tour in 1 day! Kutai Palace, Mulawarman Museum, Sultan Tomb, Kumala Island, Tepian Market. Includes lunch at riverfront restaurant. Perfect for 1 day trip from Samarinda.' },
            duration: '1 Hari', price: 450000, priceChild: 300000, location: 'Tenggarong, Kutai Kartanegara',
            category: 'Culture & Heritage', rating: 4.5, ecoRating: 3, quota: 30, bookedCount: 234, imageUrl: IMG.tenggarong,
            facilities: ['AC Transport', 'Entrance Tickets', 'Lunch', 'Guide', 'Mineral Water'], status: 'approved'
        }
    });
    await prisma.itineraryDetail.create({
        data: {
            packageId: tenggarongPkg.id, title: 'Itinerary Tenggarong', badges: ['History', 'City Tour', 'Budget'], days: [
                { day: 1, title: 'Full Day Tour', activities: ['Pickup Samarinda 08:00', 'Museum Mulawarman', 'Keraton Kutai', 'Lunch Riverfront', 'Makam Sultan', 'Pulau Kumala', 'Pasar Tepian', 'Return Samarinda 17:00'] }
            ]
        }
    });

    // ============ MODERN & URBAN (2) ============
    // 10. IKN Nusantara Discovery Tour
    const iknPkg = await prisma.tourPackage.create({
        data: {
            title: { id: 'IKN Nusantara Discovery Tour 2H1M', en: 'IKN Nusantara Discovery Tour 2D1N' },
            description: { id: 'Saksikan pembangunan Ibu Kota Negara baru! Titik Nol Nusantara, Istana Garuda, KIPP, Hutan Kota IKN. Akomodasi: Swissôtel Nusantara (★★★★★). Transport: Bus Listrik resmi IKN.', en: 'Witness the new Capital City construction! Point Zero Nusantara, Garuda Palace, KIPP, IKN City Forest. Accommodation: Swissôtel Nusantara (★★★★★). Transport: Official IKN Electric Bus.' },
            duration: '2 Hari 1 Malam', price: 1850000, priceChild: 1250000, location: 'Sepaku, Penajam Paser Utara',
            category: 'Modern & Urban', rating: 4.7, ecoRating: 5, quota: 40, bookedCount: 234, imageUrl: IMG.ikn,
            facilities: ['Hotel Bintang 5', 'Bus Listrik', 'Makan 2x', 'Guide OIKN', 'Merchandise IKN', 'Drone Foto'], status: 'approved'
        }
    });
    await prisma.itineraryDetail.create({
        data: {
            packageId: iknPkg.id, title: 'Itinerary IKN', badges: ['New Capital', 'Modern', 'Eco-City'], days: [
                { day: 1, title: 'IKN Tour', activities: ['Pickup Bandara BPN', 'Drive IKN (1.5 jam)', 'Titik Nol Nusantara', 'Lunch', 'KIPP Area', 'Menara Pantau', 'Check-in hotel', 'Dinner'] },
                { day: 2, title: 'Ecotourism', activities: ['Breakfast', 'Mangrove Mentawir', 'Foto Istana Garuda', 'Lunch', 'Transfer Bandara'] }
            ]
        }
    });

    // 11. Balikpapan City & Bangkirai
    const bangkiraiPkg = await prisma.tourPackage.create({
        data: {
            title: { id: 'Balikpapan City & Bangkirai 1H', en: 'Balikpapan City & Bangkirai 1D' },
            description: { id: 'Eksplorasi Balikpapan dalam 1 hari! Pantai Kemala, Bukit Bangkirai (Canopy Bridge 30m), Penangkaran Buaya, Islamic Center, Sunset di Manggar Beach. Perfect untuk stopover sebelum ke Derawan/IKN.', en: 'Explore Balikpapan in 1 day! Kemala Beach, Bangkirai Hill (30m Canopy Bridge), Crocodile Farm, Islamic Center, Sunset at Manggar. Perfect for stopover before Derawan/IKN.' },
            duration: '1 Hari', price: 650000, priceChild: 450000, location: 'Balikpapan, Kalimantan Timur',
            category: 'Modern & Urban', rating: 4.4, ecoRating: 4, quota: 25, bookedCount: 189, imageUrl: IMG.bangkirai,
            facilities: ['AC Transport', 'Entrance Tickets', 'Lunch', 'Mineral Water', 'Guide'], status: 'approved'
        }
    });
    await prisma.itineraryDetail.create({
        data: {
            packageId: bangkiraiPkg.id, title: 'Itinerary Balikpapan', badges: ['City Tour', 'Nature', 'Adventure'], days: [
                { day: 1, title: 'Full Day', activities: ['Pickup Hotel 08:00', 'Pantai Kemala', 'Bukit Bangkirai', 'Canopy Bridge', 'Lunch', 'Penangkaran Buaya', 'Islamic Center', 'Sunset Manggar', 'Return 18:00'] }
            ]
        }
    });

    // ============ CULINARY (1) ============
    // 12. East Kalimantan Culinary Journey
    const kulinerPkg = await prisma.tourPackage.create({
        data: {
            title: { id: 'Petualangan Kuliner Kaltim 1H', en: 'East Kalimantan Culinary Journey 1D' },
            description: { id: 'Food tour Samarinda lengkap! Soto Banjar, Ayam Cincane, Kepiting Soka, Amplang, Gangan Asam. Visit Citra Niaga, Pasar Pagi, warung legendaris. Termasuk 5 spots makan + cooking class. Bring your appetite!', en: 'Complete Samarinda food tour! Soto Banjar, Ayam Cincane, Soft Shell Crab, Amplang, Gangan Asam. Visit Citra Niaga, Morning Market, legendary warungs. Includes 5 food stops + cooking class. Bring your appetite!' },
            duration: '1 Hari', price: 350000, priceChild: 250000, location: 'Samarinda, Kalimantan Timur',
            category: 'Culinary', rating: 4.8, ecoRating: 3, quota: 20, bookedCount: 156, imageUrl: IMG.kuliner,
            facilities: ['AC Transport', '5x Food Stops', 'Cooking Class', 'Recipe Book', 'Local Guide', 'Snack Pack'], status: 'approved'
        }
    });
    await prisma.itineraryDetail.create({
        data: {
            packageId: kulinerPkg.id, title: 'Itinerary Kuliner', badges: ['Food Tour', 'Cooking', 'Local'], days: [
                { day: 1, title: 'Food Trail', activities: ['Pickup 08:00', 'Pasar Pagi (Amplang)', 'Soto Banjar breakfast', 'Citra Niaga walk', 'Ayam Cincane lunch', 'Cooking class Gangan', 'Kepiting Soka dinner', 'Return 19:00'] }
            ]
        }
    });

    // ============ ADDITIONAL PACKAGES (8 more for pagination) ============
    // 13. Pantai Amal Tarakan
    await prisma.tourPackage.create({
        data: {
            title: { id: 'Wisata Pantai Amal Tarakan 2H1M', en: 'Amal Beach Tarakan Tour 2D1N' },
            description: { id: 'Pantai terindah di Tarakan dengan pasir putih dan sunset menakjubkan. Bonus: wisata mangrove, pusat oleh-oleh, dan kuliner khas Tarakan.', en: 'Most beautiful beach in Tarakan with white sand and stunning sunset. Bonus: mangrove tour, souvenir center, and Tarakan typical cuisine.' },
            duration: '2 Hari 1 Malam', price: 1250000, priceChild: 850000, location: 'Tarakan, Kaltara',
            category: 'Marine & Islands', rating: 4.5, ecoRating: 4, quota: 25, bookedCount: 45, imageUrl: IMG.pantaiAmal,
            facilities: ['Hotel AC', 'Transport', 'Meals 2x', 'Guide', 'Snorkeling'], status: 'approved'
        }
    });

    // 14. Bukit Soeharto Conservation
    await prisma.tourPackage.create({
        data: {
            title: { id: 'Trekking Bukit Soeharto 1H', en: 'Bukit Soeharto Trekking 1D' },
            description: { id: 'Hutan lindung 61.850 hektar! Trekking ringan, birdwatching, edukasi konservasi, flying fox. Cocok untuk keluarga dan pemula.', en: '61,850 hectares protected forest! Light trekking, birdwatching, conservation education, flying fox. Suitable for families and beginners.' },
            duration: '1 Hari', price: 275000, priceChild: 175000, location: 'Kutai Kartanegara',
            category: 'Nature & Wildlife', rating: 4.4, ecoRating: 5, quota: 30, bookedCount: 89, imageUrl: IMG.bukitSoeharto,
            facilities: ['Transport', 'Ranger Guide', 'Lunch', 'Flying Fox', 'Souvenir'], status: 'approved'
        }
    });

    // 15. Pesut Mahakam Safari
    await prisma.tourPackage.create({
        data: {
            title: { id: 'Safari Pesut Mahakam 2H1M', en: 'Mahakam Dolphin Safari 2D1N' },
            description: { id: 'Observasi Pesut Mahakam, lumba-lumba air tawar endemik! Cruise pagi & sore, desa nelayan, sunset di sungai Mahakam.', en: 'Observe Mahakam Dolphins, endemic freshwater dolphins! Morning & evening cruise, fishing village, sunset on Mahakam river.' },
            duration: '2 Hari 1 Malam', price: 1850000, priceChild: 1250000, location: 'Muara Muntai, Kukar',
            category: 'Nature & Wildlife', rating: 4.7, ecoRating: 5, quota: 12, bookedCount: 34, imageUrl: IMG.pesut,
            facilities: ['Klotok Charter', 'Homestay', 'Full Meals', 'Binoculars', 'Guide', 'Documentation'], status: 'approved'
        }
    });

    // 16. Samboja Lestari Orangutan
    await prisma.tourPackage.create({
        data: {
            title: { id: 'Samboja Lestari Orangutan Visit 1H', en: 'Samboja Lestari Orangutan Visit 1D' },
            description: { id: 'Kunjungi rehabilitasi orangutan Borneo Orangutan Survival Foundation! Education center, feeding time, artificial island, sun bear sanctuary.', en: 'Visit Borneo Orangutan Survival Foundation rehabilitation! Education center, feeding time, artificial island, sun bear sanctuary.' },
            duration: '1 Hari', price: 450000, priceChild: 300000, location: 'Samboja, Kutai Kartanegara',
            category: 'Nature & Wildlife', rating: 4.9, ecoRating: 5, quota: 40, bookedCount: 156, imageUrl: IMG.samboja,
            facilities: ['Transport', 'Entry Fee', 'Guide', 'Lunch', 'Souvenir'], status: 'approved'
        }
    });

    // 17. Gunung Beratus Expedition
    await prisma.tourPackage.create({
        data: {
            title: { id: 'Ekspedisi Gunung Beratus 3H2M', en: 'Mount Beratus Expedition 3D2N' },
            description: { id: 'Pendakian Gunung Beratus (1.033 mdpl)! Jalur menantang, flora fauna endemic, camping under stars, sunrise spektakuler. Level: Moderate.', en: 'Mount Beratus climbing (1,033 masl)! Challenging trail, endemic flora fauna, camping under stars, spectacular sunrise. Level: Moderate.' },
            duration: '3 Hari 2 Malam', price: 1650000, priceChild: 1200000, location: 'Pasir, Kalimantan Timur',
            category: 'Nature & Wildlife', rating: 4.6, ecoRating: 5, quota: 15, bookedCount: 28, imageUrl: IMG.beratus,
            facilities: ['Transport', 'Camping Gear', 'Porter', 'Full Meals', 'Guide', 'P3K'], status: 'approved'
        }
    });

    // 18. Tarakan City Heritage
    await prisma.tourPackage.create({
        data: {
            title: { id: 'City Tour Tarakan Heritage 1H', en: 'Tarakan Heritage City Tour 1D' },
            description: { id: 'Jejak sejarah Perang Dunia II di Tarakan! Museum AURI, Bunker Jepang, Tugu Australia, Pantai Juata, Mangrove Center.', en: 'World War II heritage trail in Tarakan! AURI Museum, Japanese Bunker, Australian Monument, Juata Beach, Mangrove Center.' },
            duration: '1 Hari', price: 325000, priceChild: 225000, location: 'Tarakan, Kalimantan Utara',
            category: 'Culture & Heritage', rating: 4.3, ecoRating: 3, quota: 20, bookedCount: 67, imageUrl: IMG.tarakan,
            facilities: ['AC Transport', 'Entry Fees', 'Lunch', 'Guide', 'Mineral Water'], status: 'approved'
        }
    });

    // 19. Sungai Kayan Adventure
    await prisma.tourPackage.create({
        data: {
            title: { id: 'Rafting Sungai Kayan 2H1M', en: 'Kayan River Rafting 2D1N' },
            description: { id: 'Arung jeram kelas III-IV di Sungai Kayan! Rapids menantang, scenery spektakuler, camping riverside, BBQ malam.', en: 'Class III-IV rafting on Kayan River! Challenging rapids, spectacular scenery, riverside camping, evening BBQ.' },
            duration: '2 Hari 1 Malam', price: 1450000, priceChild: 950000, location: 'Bulungan, Kalimantan Utara',
            category: 'Nature & Wildlife', rating: 4.8, ecoRating: 4, quota: 16, bookedCount: 56, imageUrl: IMG.labuanCermin,
            facilities: ['Rafting Gear', 'Safety Equipment', 'Camping', 'Full Meals', 'Professional Guide', 'Documentation'], status: 'approved'
        }
    });

    // 20. Teluk Balikpapan Mangrove
    await prisma.tourPackage.create({
        data: {
            title: { id: 'Ekowisata Mangrove Balikpapan 1H', en: 'Balikpapan Mangrove Ecotourism 1D' },
            description: { id: 'Jelajahi ekosistem mangrove Teluk Balikpapan! Kayaking, boardwalk, birdwatching, edukasi lingkungan, sunset cruise.', en: 'Explore Balikpapan Bay mangrove ecosystem! Kayaking, boardwalk, birdwatching, environmental education, sunset cruise.' },
            duration: '1 Hari', price: 285000, priceChild: 185000, location: 'Balikpapan, Kalimantan Timur',
            category: 'Nature & Wildlife', rating: 4.5, ecoRating: 5, quota: 25, bookedCount: 112, imageUrl: IMG.marine,
            facilities: ['Kayak', 'Life Jacket', 'Guide', 'Snack', 'Documentation', 'Mineral Water'], status: 'approved'
        }
    });

    // =============================================
    // EVENTS - 12 EVENTS (6 existing + 6 new)
    // =============================================
    console.log('📅 Creating Events...');

    // 1. Festival Erau
    await prisma.event.create({
        data: {
            title: { id: 'Festival Erau Adat Kutai 2024', en: 'Erau Traditional Festival 2024' },
            description: { id: 'Pesta rakyat Kesultanan Kutai Kartanegara! 800 penari adat, Ritual Belimbur, Prosesi Mengulur Naga, Balap Ketinting. Lokasi: Stadion Rondong Demang & Keraton, Tenggarong.', en: 'Kutai Kartanegara Sultanate folk festival! 800 traditional dancers, Belimbur ritual, Dragon Procession, Ketinting race. Location: Rondong Demang Stadium & Palace, Tenggarong.' },
            date: '21-30 September 2024', location: 'Tenggarong, Kutai Kartanegara', category: 'Culture',
            price: 'Gratis', quota: 50000, bookedCount: 12500, imageUrl: IMG.erau, status: 'approved', organizerId: mitra.id,
            tags: ['budaya', 'festival', 'tradisional', 'kutai']
        }
    });

    // 2. Borneo International Triathlon
    await prisma.event.create({
        data: {
            title: { id: 'Borneo International Triathlon 2024', en: 'Borneo International Triathlon 2024' },
            description: { id: 'Triathlon internasional pertama di Kaltim! Olympic Distance, Sprint Distance, Fun Run 5km & 10km. Venue: Pantai Kemala Balikpapan. Prize Pool: IDR 500 juta.', en: 'First international triathlon in East Kalimantan! Olympic Distance, Sprint Distance, Fun Run 5km & 10km. Venue: Kemala Beach Balikpapan. Prize Pool: IDR 500 million.' },
            date: '17 November 2024', location: 'Balikpapan, Kalimantan Timur', category: 'Nature',
            price: 'Rp 750.000', priceChild: 350000, quota: 2000, bookedCount: 856, imageUrl: IMG.borneo, status: 'approved', organizerId: mitra.id,
            tags: ['olahraga', 'triathlon', 'internasional', 'balikpapan']
        }
    });

    // 3. IKN Independence Day
    await prisma.event.create({
        data: {
            title: { id: 'Upacara HUT RI ke-79 di IKN', en: 'Indonesia 79th Independence Day at IKN' },
            description: { id: 'Upacara bendera perdana di Ibu Kota Nusantara! Parade budaya 34 provinsi, kembang api spektakuler, konser musik nasional. Akses gratis via registrasi OIKN.', en: 'First flag ceremony at Nusantara Capital! Cultural parade of 34 provinces, spectacular fireworks, national music concert. Free access via OIKN registration.' },
            date: '17 Agustus 2024', location: 'Titik Nol IKN, Penajam Paser Utara', category: 'Culture',
            price: 'Gratis', quota: 10000, bookedCount: 10000, imageUrl: IMG.inti, status: 'approved', organizerId: admin.id,
            tags: ['kemerdekaan', 'ikn', 'nasional', 'gratis']
        }
    });

    // 4. Derawan Marine Festival
    await prisma.event.create({
        data: {
            title: { id: 'Derawan Marine Festival 2024', en: 'Derawan Marine Festival 2024' },
            description: { id: 'Festival bahari tahunan di Kepulauan Derawan! Lomba foto underwater, workshop konservasi penyu, kompetisi freediving, pertunjukan budaya Bajau, beach party. Highlight: Turtle Release Ceremony.', en: 'Annual marine festival in Derawan Islands! Underwater photo contest, turtle conservation workshop, freediving competition, Bajau cultural show, beach party. Highlight: Turtle Release Ceremony.' },
            date: '15-20 Juli 2024', location: 'Pulau Derawan, Berau', category: 'Nature',
            price: 'Gratis', quota: 5000, bookedCount: 2340, imageUrl: IMG.marineFest, status: 'approved', organizerId: mitra.id,
            tags: ['marine', 'konservasi', 'diving', 'derawan', 'bahari']
        }
    });

    // 5. Samarinda Food Festival
    await prisma.event.create({
        data: {
            title: { id: 'Festival Kuliner Samarinda 2024', en: 'Samarinda Food Festival 2024' },
            description: { id: 'Perayaan kuliner terbesar Kalimantan! 100+ tenant makanan lokal & nasional, cooking competition, mukbang challenge, live music, demo masak chef terkenal. Lokasi: Citra Niaga Complex.', en: 'Biggest culinary celebration in Kalimantan! 100+ local & national food tenants, cooking competition, mukbang challenge, live music, celebrity chef demo. Location: Citra Niaga Complex.' },
            date: '10-15 Oktober 2024', location: 'Citra Niaga, Samarinda', category: 'Culinary',
            price: 'Rp 25.000', quota: 30000, bookedCount: 8500, imageUrl: IMG.foodFest, status: 'approved', organizerId: mitra.id,
            tags: ['kuliner', 'food', 'festival', 'samarinda']
        }
    });

    // 6. Borneo Jazz Festival
    await prisma.event.create({
        data: {
            title: { id: 'Borneo Jazz International 2024', en: 'Borneo Jazz International 2024' },
            description: { id: 'Festival musik jazz internasional di Balikpapan! Lineup: musisi jazz Indonesia & internasional, workshops, jam sessions, food court premium. Venue: Big Bear Convention Center dengan view Pantai Kemala.', en: 'International jazz festival in Balikpapan! Lineup: Indonesian & international jazz musicians, workshops, jam sessions, premium food court. Venue: Big Bear Convention Center with Kemala Beach view.' },
            date: '6-8 Desember 2024', location: 'Big Bear Convention Center, Balikpapan', category: 'Culture',
            price: 'Rp 350.000', priceChild: 175000, quota: 8000, bookedCount: 4500, imageUrl: IMG.jazzFest, status: 'approved', organizerId: mitra.id,
            tags: ['musik', 'jazz', 'internasional', 'balikpapan', 'konser']
        }
    });

    // 7. Festival Budaya Dayak (NEW)
    await prisma.event.create({
        data: {
            title: { id: 'Festival Budaya Dayak Kaltim 2024', en: 'East Kalimantan Dayak Cultural Festival 2024' },
            description: { id: 'Perayaan budaya suku Dayak Kaltim! Tarian tradisional, musik Sape, pameran kerajinan, kuliner khas Dayak, lomba blowpipe. Lokasi: Desa Budaya Pampang, Samarinda.', en: 'Celebration of East Kalimantan Dayak culture! Traditional dances, Sape music, handicraft exhibition, Dayak cuisine, blowpipe competition. Location: Pampang Cultural Village, Samarinda.' },
            date: '5-7 April 2025', location: 'Desa Budaya Pampang, Samarinda', category: 'Culture',
            price: 'Rp 35.000', quota: 15000, bookedCount: 3200, imageUrl: IMG.dayakFest, status: 'approved', organizerId: mitra.id,
            tags: ['dayak', 'budaya', 'tradisional', 'samarinda']
        }
    });

    // 8. Balikpapan International Marathon (NEW)
    await prisma.event.create({
        data: {
            title: { id: 'Balikpapan International Marathon 2025', en: 'Balikpapan International Marathon 2025' },
            description: { id: 'Marathon internasional dengan rute pesisir terbaik! Full Marathon, Half Marathon, 10K, 5K Fun Run. Finisher medal, jersey premium, post-race party. Rute: Pantai Kemala - Manggar coastal road.', en: 'International marathon with the best coastal route! Full Marathon, Half Marathon, 10K, 5K Fun Run. Finisher medal, premium jersey, post-race party. Route: Kemala Beach - Manggar coastal road.' },
            date: '23 Februari 2025', location: 'Pantai Kemala, Balikpapan', category: 'Nature',
            price: 'Rp 450.000', quota: 5000, bookedCount: 2100, imageUrl: IMG.marathon, status: 'approved', organizerId: mitra.id,
            tags: ['marathon', 'olahraga', 'run', 'balikpapan']
        }
    });

    // 9. Kancil Conservation Run (NEW)
    await prisma.event.create({
        data: {
            title: { id: 'Kancil Conservation Run 2025', en: 'Kancil Conservation Run 2025' },
            description: { id: 'Trail run di Taman Nasional Kutai untuk konservasi satwa! 21K Ultra Trail, 10K Trail, 5K Family Run. Sebagian hasil untuk perlindungan orangutan dan pesut Mahakam.', en: 'Trail run in Kutai National Park for wildlife conservation! 21K Ultra Trail, 10K Trail, 5K Family Run. Proceeds support orangutan and Mahakam dolphin protection.' },
            date: '15 Maret 2025', location: 'Taman Nasional Kutai, Bontang', category: 'Nature',
            price: 'Rp 250.000', quota: 2000, bookedCount: 890, imageUrl: IMG.kancilRun, status: 'approved', organizerId: mitra.id,
            tags: ['trail', 'run', 'konservasi', 'kutai']
        }
    });

    // 10. Mahakam Music Festival (NEW)
    await prisma.event.create({
        data: {
            title: { id: 'Mahakam Music Festival 2025', en: 'Mahakam Music Festival 2025' },
            description: { id: 'Festival musik terbesar di tepi Sungai Mahakam! Multi-genre: pop, rock, EDM, folk. Panggung terapung, fireworks, food trucks, glamping area. 3 hari non-stop entertainment!', en: 'Biggest music festival by Mahakam River! Multi-genre: pop, rock, EDM, folk. Floating stage, fireworks, food trucks, glamping area. 3 days non-stop entertainment!' },
            date: '20-22 Juni 2025', location: 'Tepian Mahakam, Samarinda', category: 'Culture',
            price: 'Rp 275.000', priceChild: 150000, quota: 25000, bookedCount: 8500, imageUrl: IMG.mahakamMusic, status: 'approved', organizerId: mitra.id,
            tags: ['musik', 'festival', 'mahakam', 'samarinda']
        }
    });

    // 11. IKN Green Run (NEW)
    await prisma.event.create({
        data: {
            title: { id: 'IKN Green Run 2025', en: 'IKN Green Run 2025' },
            description: { id: 'Run sambil melihat pembangunan IKN! Rute melalui landmark IKN: Istana, ASN Village, Forest City. Tema: sustainability & green energy. Post-run: tree planting ceremony.', en: 'Run while seeing IKN development! Route through IKN landmarks: Palace, ASN Village, Forest City. Theme: sustainability & green energy. Post-run: tree planting ceremony.' },
            date: '22 April 2025', location: 'IKN Nusantara, PPU', category: 'Nature',
            price: 'Rp 200.000', quota: 10000, bookedCount: 4200, imageUrl: IMG.greenRun, status: 'approved', organizerId: admin.id,
            tags: ['run', 'ikn', 'green', 'sustainability']
        }
    });

    // 12. Cap Go Meh Balikpapan (NEW)
    await prisma.event.create({
        data: {
            title: { id: 'Festival Cap Go Meh Balikpapan 2026', en: 'Cap Go Meh Festival Balikpapan 2026' },
            description: { id: 'Perayaan Cap Go Meh terbesar di Kalimantan! Parade barongsai & naga, pertunjukan wushu, pasar malam, pesta kembang api. Pusat: Kelenteng Gunung Timur.', en: 'Biggest Cap Go Meh celebration in Kalimantan! Lion & dragon dance parade, wushu performance, night market, fireworks party. Center: Gunung Timur Temple.' },
            date: '17 Februari 2026', location: 'Gunung Timur, Balikpapan', category: 'Culture',
            price: 'Gratis', quota: 50000, bookedCount: 0, imageUrl: IMG.capGoMeh, status: 'approved', organizerId: mitra.id,
            tags: ['imlek', 'budaya', 'barongsai', 'balikpapan']
        }
    });

    // ============ 2026 EVENTS ============
    // 13. Borneo Culture Week 7.0 (Real event: August 7-9, 2026)
    await prisma.event.create({
        data: {
            title: { id: 'Borneo Culture Week 7.0', en: 'Borneo Culture Week 7.0' },
            description: { id: 'Festival budaya terbesar di Kaltim! Pertunjukan tari Dayak, Hudog, Topeng, kompetisi seni, pameran kerajinan, showcase kuliner Nusantara. Lokasi: Bay Park Plaza dengan akses GRATIS!', en: 'Biggest cultural festival in East Kalimantan! Dayak, Hudog, Topeng dance performances, art competitions, handicraft exhibitions, Nusantara culinary showcase. Location: Bay Park Plaza with FREE entry!' },
            date: '7-9 Agustus 2026', location: 'Bay Park Plaza, Balikpapan', category: 'Culture',
            price: 'Gratis', quota: 30000, bookedCount: 0, imageUrl: IMG.borneoCultureWeek, status: 'approved', organizerId: mitra.id,
            tags: ['budaya', 'dayak', 'festival', 'balikpapan', '2026']
        }
    });

    // 14. Balikpapan Fest 2026 - Coastal Nusantara (Real event: Sep 24-27, 2026)
    await prisma.event.create({
        data: {
            title: { id: 'Balikpapan Fest 2026 - Coastal Nusantara', en: 'Balikpapan Fest 2026 - Coastal Nusantara' },
            description: { id: 'Festival tahunan terbesar Balikpapan dengan tema "Coastal Nusantara"! 4 hari penuh pertunjukan musik, bazaar UMKM, pameran seni, food court, dan aktivitas menarik. Venue: BSCC Dome.', en: 'Biggest annual Balikpapan festival with "Coastal Nusantara" theme! 4 days full of music performances, UMKM bazaar, art exhibitions, food court, and exciting activities. Venue: BSCC Dome.' },
            date: '24-27 September 2026', location: 'BSCC Dome, Balikpapan', category: 'Culture',
            price: 'Rp 50.000', priceChild: 25000, quota: 40000, bookedCount: 0, imageUrl: IMG.balikpapanFest, status: 'approved', organizerId: mitra.id,
            tags: ['festival', 'balikpapan', 'coastal', '2026']
        }
    });

    // 15. East Borneo International Folklore Festival 2026
    await prisma.event.create({
        data: {
            title: { id: 'East Borneo International Folklore Festival 2026', en: 'East Borneo International Folklore Festival 2026' },
            description: { id: 'Festival folklor internasional di Samarinda! Pertukaran budaya global, pertunjukan musik tradisional, atraksi komunitas, dan pameran dari IKN Nusantara. Diselenggarakan oleh CIOFF Indonesia.', en: 'International folklore festival in Samarinda! Global cultural exchange, traditional music performances, community attractions, and exhibitions from IKN Nusantara. Organized by CIOFF Indonesia.' },
            date: '24-26 Juli 2026', location: 'Samarinda, Kalimantan Timur', category: 'Culture',
            price: 'Rp 35.000', quota: 20000, bookedCount: 0, imageUrl: IMG.folkloreFest, status: 'approved', organizerId: mitra.id,
            tags: ['internasional', 'folklore', 'samarinda', '2026']
        }
    });

    // 16. HUT RI ke-81 di IKN Nusantara 2026
    await prisma.event.create({
        data: {
            title: { id: 'Upacara HUT RI ke-81 di IKN Nusantara', en: 'Indonesia 81st Independence Day at IKN Nusantara' },
            description: { id: 'Upacara kemerdekaan Indonesia ke-81 di Ibu Kota Nusantara! Parade budaya 38 provinsi, konser musik nasional, pesta kembang api spektakuler. Saksikan sejarah baru Indonesia!', en: 'Indonesia 81st Independence Day ceremony at Nusantara Capital! Cultural parade of 38 provinces, national music concert, spectacular fireworks. Witness new Indonesian history!' },
            date: '17 Agustus 2026', location: 'Istana Negara IKN, Penajam Paser Utara', category: 'Culture',
            price: 'Gratis', quota: 50000, bookedCount: 0, imageUrl: IMG.iknHutRi, status: 'approved', organizerId: admin.id,
            tags: ['kemerdekaan', 'ikn', 'nasional', '2026']
        }
    });

    // =============================================
    // TESTIMONIALS
    // =============================================
    console.log('💬 Creating Testimonials...');
    await prisma.testimonial.createMany({
        data: [
            { name: 'Sarah Mitchell', role: 'Travel Blogger, Australia', content: 'Derawan exceeded all expectations! Swimming with stingless jellyfish at Kakaban was absolutely magical. BorneoTrip made everything seamless.', rating: 5, avatarUrl: '/images/testimonials/sarah.svg' },
            { name: 'Andi Pratama', role: 'Fotografer, Jakarta', content: 'Ekspedisi Wehea adalah pengalaman terbaik dalam hidup saya. Melihat orangutan liar dari jarak 10 meter... tak terlupakan!', rating: 5, avatarUrl: '/images/testimonials/andi.svg' },
            { name: 'Kenji Tanaka', role: 'Dive Instructor, Japan', content: 'Maratua is world-class diving. The Channel dive site rivals the best in SE Asia. Highly recommend the Paradise Resort package.', rating: 5, avatarUrl: '/images/testimonials/kenji.svg' },
            { name: 'Lisa Chen', role: 'Food Blogger, Singapore', content: 'The Culinary Journey tour was amazing! From Soto Banjar to Kepiting Soka, every dish told a story. The cooking class was the highlight!', rating: 5, avatarUrl: '/images/testimonials/lisa.svg' },
            { name: 'Michael Brown', role: 'Adventure Traveler, UK', content: 'IKN tour blew my mind. Watching Indonesia build a new capital city from scratch was inspiring. Future looks bright!', rating: 5, avatarUrl: '/images/testimonials/michael.svg' }
        ]
    });

    console.log('✅ Database seeded successfully!');
    console.log('📊 Summary:');
    console.log('   - 5 Categories');
    console.log('   - 6 Regions');
    console.log('   - 3 Users (admin, mitra, customer)');
    console.log('   - 20 Tour Packages with Itineraries');
    console.log('   - 16 Events (including 4 for 2026)');
    console.log('   - 5 Testimonials');
}

main()
    .catch((e) => { console.error('❌ Seed error:', e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });


