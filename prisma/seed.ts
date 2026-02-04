
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // --- Clean DB ---
    console.log('🧹 Cleaning existing data...');
    await prisma.message.deleteMany();
    await prisma.chatSession.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.paymentMethod.deleteMany();
    await prisma.address.deleteMany();
    await prisma.event.deleteMany();
    await prisma.tourPackage.deleteMany();
    await prisma.user.deleteMany();
    await prisma.region.deleteMany();
    await prisma.category.deleteMany();

    // --- Categories ---
    console.log('🏷️ Creating Categories...');
    await prisma.category.createMany({
        data: [
            {
                name: { en: 'Nature & Wildlife', id: 'Alam & Hewan Liar' },
                icon: '🌳',
                imageUrl: 'https://images.unsplash.com/photo-1541348166540-3b692d770c69?q=80&w=1000&auto=format&fit=crop'
            },
            {
                name: { en: 'Marine & Islands', id: 'Bahari & Kepulauan' },
                icon: '🏝️',
                imageUrl: 'https://images.unsplash.com/photo-1596401057633-565652b5d249?q=80&w=1000&auto=format&fit=crop'
            },
            {
                name: { en: 'Culture & Heritage', id: 'Budaya & Warisan' },
                icon: '👺',
                imageUrl: 'https://images.unsplash.com/photo-1627393166858-6a56c429676e?q=80&w=1000&auto=format&fit=crop'
            },
            {
                name: { en: 'Modern & Urban', id: 'Kota Modern' },
                icon: '🏙️',
                imageUrl: 'https://images.unsplash.com/photo-1636952765355-66795f7267eb?q=80&w=1000&auto=format&fit=crop'
            },
            {
                name: { en: 'Culinary', id: 'Kuliner' },
                icon: '🍽️',
                imageUrl: 'https://images.unsplash.com/photo-1626082896492-766af4eb6501?q=80&w=1000&auto=format&fit=crop'
            }
        ]
    });

    // --- Regions ---
    console.log('🗺️ Creating Regions...');
    await prisma.region.createMany({
        data: [
            {
                name: 'Samarinda',
                type: 'Kota',
                capital: 'Samarinda',
                leader: 'Andi Harun',
                area: '718.00',
                population: '868,499',
                density: '1,210',
                districts: 10,
                villages: '59 Kelurahan',
                latitude: -0.5022,
                longitude: 117.1536,
                imageUrl: 'https://images.unsplash.com/photo-1636952765355-66795f7267eb?q=80&w=1000&auto=format&fit=crop',
                destinations: ['Islamic Center', 'Mahakam River', 'Pampang Cultural Village']
            },
            {
                name: 'Balikpapan',
                type: 'Kota',
                capital: 'Balikpapan',
                leader: 'Rahmad Mas\'ud',
                area: '511.01',
                population: '757,418',
                density: '1,482',
                districts: 6,
                villages: '34 Kelurahan',
                latitude: -1.2379,
                longitude: 116.8529,
                imageUrl: 'https://images.unsplash.com/photo-1619946450654-7d8858db194a?q=80&w=1000&auto=format&fit=crop',
                destinations: ['Kemala Beach', 'Samboja Lestari', 'Carribean Island Waterpark']
            },
            {
                name: 'Bontang',
                type: 'Kota',
                capital: 'Bontang',
                leader: 'Basri Rase',
                area: '161.88',
                population: '191,811',
                density: '1,185',
                districts: 3,
                villages: '15 Kelurahan',
                latitude: 0.1332,
                longitude: 117.5000,
                imageUrl: 'https://images.unsplash.com/photo-1595168434316-d3524a8775df?q=80&w=1000&auto=format&fit=crop', // Generic Industrial/Port
                destinations: ['Bontang Mangrove Park', 'Beras Basah Island', 'Kutai National Park']
            },
            {
                name: 'Kutai Kartanegara',
                type: 'Kabupaten',
                capital: 'Tenggarong',
                leader: 'Edi Damansyah',
                area: '27,263.10',
                population: '789,767',
                density: '29',
                districts: 18,
                villages: '238 Desa/Kelurahan',
                latitude: -0.4000,
                longitude: 117.0000,
                imageUrl: 'https://images.unsplash.com/photo-1549480397-28d15a51989e?q=80&w=1000&auto=format&fit=crop',
                destinations: ['Museum Mulawarman', 'Ladaya', 'Pulau Kumala']
            },
            {
                name: 'Berau',
                type: 'Kabupaten',
                capital: 'Tanjung Redeb',
                leader: 'Sri Juniarsih Mas',
                area: '36,962.37',
                population: '299,005',
                density: '8',
                districts: 13,
                villages: '110 Desa/Kelurahan',
                latitude: 2.1500,
                longitude: 117.5000,
                imageUrl: 'https://images.unsplash.com/photo-1578496480157-58e846059d62?q=80&w=1000&auto=format&fit=crop',
                destinations: ['Derawan Islands', 'Labuan Cermin', 'Kakaban']
            },
            {
                name: 'Kutai Barat',
                type: 'Kabupaten',
                capital: 'Sendawar',
                leader: 'F.X. Yapan',
                area: '20,384.60',
                population: '186,581',
                density: '9',
                districts: 16,
                villages: '194 Desa/Kelurahan',
                latitude: -0.5000,
                longitude: 115.5000,
                imageUrl: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?q=80&w=1000&auto=format&fit=crop',
                destinations: ['Kersik Luway', 'Jantur Inar', 'Lamin Long Iram']
            },
            {
                name: 'Kutai Timur',
                type: 'Kabupaten',
                capital: 'Sangatta',
                leader: 'Ardiansyah Sulaiman',
                area: '31,239.84',
                population: '448,850',
                density: '14',
                districts: 18,
                villages: '141 Desa/Kelurahan',
                latitude: 0.9000,
                longitude: 117.5000,
                imageUrl: 'https://images.unsplash.com/photo-1579290074697-3f303f90b2b8?q=80&w=1000&auto=format&fit=crop', // Forest/Park
                destinations: ['Kutai National Park', 'Prevab', 'Teluk Lombok']
            },
            {
                name: 'Penajam Paser Utara',
                type: 'Kabupaten',
                capital: 'Penajam',
                leader: 'Makmur Marbun (Pj)',
                area: '3,333.06',
                population: '202,067',
                density: '61',
                districts: 4,
                villages: '54 Desa/Kelurahan',
                latitude: -1.2500,
                longitude: 116.6667,
                imageUrl: 'https://images.unsplash.com/photo-1549480397-28d15a51989e?q=80&w=1000&auto=format&fit=crop', // IKN Area
                destinations: ['Titik Nol Nusantara', 'Mangrove Center', 'Nipah-Nipah Beach']
            },
            {
                name: 'Mahakam Ulu',
                type: 'Kabupaten',
                capital: 'Ujoh Bilang',
                leader: 'Bonifasius Belawan Geh',
                area: '18,427.81',
                population: '39,319',
                density: '2',
                districts: 5,
                villages: '50 Desa',
                latitude: 0.8333,
                longitude: 115.1667,
                imageUrl: 'https://images.unsplash.com/photo-1448375240586-dfd8d395ea6c?q=80&w=1000&auto=format&fit=crop',
                destinations: ['Long Apari', 'Riam Udang', 'Kenyah Culture']
            },
            {
                name: 'Paser',
                type: 'Kabupaten',
                capital: 'Tanah Grogot',
                leader: 'Fahmi Fadli',
                area: '11,603.94',
                population: '309,667',
                density: '27',
                districts: 10,
                villages: '144 Desa/Kelurahan',
                latitude: -1.8000,
                longitude: 116.0000,
                imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000&auto=format&fit=crop',
                destinations: ['Museum Sadurengas', 'Pasir Mayang Beach', 'Mount Boga']
            }
        ]
    });

    // --- Users ---
    console.log('👤 Creating Users...');
    const password = await hash('password123', 12);

    const admin = await prisma.user.create({
        data: {
            name: 'Admin Borneo',
            email: 'admin@borneotrip.id',
            password,
            role: 'admin',
            onboardingCompleted: true,
            bio: 'Administrator of BorneoTrip Platform.',
        },
    });

    const mitra = await prisma.user.create({
        data: {
            name: 'Derawan Dive Resort',
            email: 'mitra@derawan.com',
            password,
            role: 'mitra',
            onboardingCompleted: true,
            bio: 'Premium Dive Resort Partner in Derawan Islands.',
        },
    });

    const client = await prisma.user.create({
        data: {
            name: 'Dian Sastro',
            email: 'user@example.com',
            password,
            role: 'client',
            onboardingCompleted: true,
            phone: '+6281234567890',
            idNumber: '6471010101010001',
            bio: 'Travel enthusiast looking for hidden gems in Borneo.',
            preferences: {
                currency: 'IDR',
                language: 'id',
                notifications: { email: true, push: true },
                interests: ['Nature', 'Diving', 'Culture']
            },
        },
    });

    // --- Addresses ---
    console.log('📍 Creating Addresses...');
    await prisma.address.create({
        data: {
            userId: client.id,
            label: 'Home',
            recipientName: 'Dian Sastro',
            phone: '+6281234567890',
            address: 'Jl. Jenderal Sudirman No. 123, Balikpapan Kota',
            city: 'Balikpapan',
            postalCode: '76113',
            isDefault: true,
        },
    });

    await prisma.address.create({
        data: {
            userId: client.id,
            label: 'Office',
            recipientName: 'Dian Sastro (Office)',
            phone: '+6281234567890',
            address: 'Gedung BRI Tower Lt. 5, Jl. MT Haryono',
            city: 'Samarinda',
            postalCode: '75123',
            isDefault: false,
        },
    });

    // --- Payment Methods ---
    console.log('💳 Creating Payment Methods...');
    await prisma.paymentMethod.create({
        data: {
            userId: client.id,
            provider: 'card',
            brand: 'Visa',
            last4: '4242',
            holder: 'Dian Sastro',
            expiry: '12/28',
        },
    });

    // --- Tour Packages ---
    console.log('🏝️ Creating Tour Packages...');
    const derawan = await prisma.tourPackage.create({
        data: {
            title: { id: 'Eksotis Derawan 4H3M', en: 'Exotic Derawan 4D3N' },
            description: {
                id: 'Nikmati keindahan kepulauan Derawan, Maratua, Kakaban, dan Sangalaki. Berenang bersama ubur-ubur tanpa sengat dan penyu hijau raksasa.',
                en: 'Enjoy the beauty of Derawan, Maratua, Kakaban, and Sangalaki islands. Swim with stingless jellyfish and giant green turtles.'
            },
            duration: '4 Days 3 Nights',
            price: 3500000,
            priceChild: 2500000,
            location: 'Berau, Kalimantan Timur',
            rating: 4.8,
            ecoRating: 5,
            quota: 20,
            bookedCount: 5,
            imageUrl: 'https://images.unsplash.com/photo-1578496480157-58e846059d62?q=80&w=1000&auto=format&fit=crop', // Stock beach
            facilities: ['Resort AC', 'Speedboat', 'Documentation', 'Meals', 'Guide'],
        },
    });

    const labuan = await prisma.tourPackage.create({
        data: {
            title: { id: 'Labuan Cermin & Whaleshark', en: 'Labuan Cermin & Whaleshark' },
            description: {
                id: 'Jelajahi danau dua rasa Labuan Cermin yang magis dan berenang bersama Hiu Paus di Talisayan.',
                en: 'Explore the magical two-flavor lake of Labuan Cermin and swim with Whale Sharks in Talisayan.'
            },
            duration: '3 Days 2 Nights',
            price: 2800000,
            priceChild: 1800000,
            location: 'Biduk-Biduk, Kalimantan Timur',
            rating: 4.9,
            ecoRating: 4,
            quota: 15,
            bookedCount: 2,
            imageUrl: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?q=80&w=1000&auto=format&fit=crop', // Clear water
            facilities: ['Homestay', 'Alat Snorkeling', 'Makan', 'Transport Darat'],
        },
    });

    const ikn = await prisma.tourPackage.create({
        data: {
            title: { id: 'IKN Nusantara Tech Tour', en: 'IKN Nusantara Tech Tour' },
            description: {
                id: 'Kunjungan eksklusif ke Titik Nol Nusantara dan kawasan inti pusat pemerintahan masa depan Indonesia.',
                en: 'Exclusive visit to Point Zero Nusantara and the core government area of Indonesia\'s future capital.'
            },
            duration: '1 Day',
            price: 750000,
            priceChild: 500000,
            location: 'Sepaku, Penajam Paser Utara',
            rating: 4.7,
            ecoRating: 5,
            quota: 50,
            bookedCount: 12,
            imageUrl: 'https://images.unsplash.com/photo-1549480397-28d15a51989e?q=80&w=1000&auto=format&fit=crop', // Forest/Modern concept
            facilities: ['Bus Listrik', 'Lunch Box', 'Merchandise', 'Official Guide'],
        },
    });

    const wehea = await prisma.tourPackage.create({
        data: {
            title: { id: 'Ekspedisi Hutan Lindung Wehea', en: 'Wehea Forest Expedition' },
            description: {
                id: 'Petualangan 5 hari menembus hutan hujan Wehea. Bertemu Orangutan liar, Rusa Sambar dan masyarakat Dayak Wehea yang menjaga hutan.',
                en: '5-days adventure through the Wehea rainforest. Meet wild Orangutans, Sambar Deer and the Dayak Wehea community who guard the forest.'
            },
            duration: '5 Days 4 Nights',
            price: 4500000,
            priceChild: 3000000,
            location: 'Muara Wahau, Kutai Timur',
            rating: 5.0,
            ecoRating: 5,
            quota: 8,
            bookedCount: 3,
            imageUrl: 'https://images.unsplash.com/photo-1516934024742-b461fba47600?q=80&w=1000&auto=format&fit=crop', // Rainforest
            facilities: ['Jungle Lodge', '4WD Transport', 'Ranger', 'Meals', 'Porter'],
        },
    });

    const mahakam = await prisma.tourPackage.create({
        data: {
            title: { id: 'Mahakam River Houseboat Safari', en: 'Mahakam River Houseboat Safari' },
            description: {
                id: 'Menyusuri Sungai Mahakam dengan kapal wisata tradisional. Mengunjungi desa Dayak Benuaq, melihat Pesut Mahakam, dan anggrek hitam.',
                en: 'Cruising the Mahakam River on a traditional houseboat. Visit Dayak Benuaq villages, spot Mahakam Dolphins, and black orchids.'
            },
            duration: '4 Days 3 Nights',
            price: 3200000,
            priceChild: 2000000,
            location: 'Mahakam Ulu, Kalimantan Timur',
            rating: 4.6,
            ecoRating: 4,
            quota: 12,
            bookedCount: 6,
            imageUrl: 'https://images.unsplash.com/photo-1564659907532-6b3f98c86024?q=80&w=1000&auto=format&fit=crop', // River boat
            facilities: ['Houseboat Cabin', 'Full Board Meals', 'Cultural Performance', 'Local Guide'],
        },
    });

    const maratua = await prisma.tourPackage.create({
        data: {
            title: { id: 'Maratua Paradise Dive Trip', en: 'Maratua Paradise Dive Trip' },
            description: {
                id: 'Paket khusus penyelam bersertifikat untuk eksplorasi "Big Fish Country" Maratua. Channel point, Turtle Traffic, dan Barracuda Point.',
                en: 'Special package for certified divers to explore Maratua\'s "Big Fish Country". Channel point, Turtle Traffic, and Barracuda Point.'
            },
            duration: '5 Days 4 Nights',
            price: 5500000,
            priceChild: 4000000,
            location: 'Maratua, Berau',
            rating: 4.9,
            ecoRating: 5,
            quota: 10,
            bookedCount: 8,
            imageUrl: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?q=80&w=1000&auto=format&fit=crop', // Underwater/Diving
            facilities: ['Water Villa', '10x Dives', 'Dive Gear', 'Meals', 'Instructor'],
        },
    });

    // --- Events ---
    console.log('📅 Creating Events...');
    const erau = await prisma.event.create({
        data: {
            title: { id: 'Festival Erau 2026', en: 'Erau Festival 2026' },
            description: {
                id: 'Upacara adat Kesultanan Kutai Kartanegara Ing Martadipura yang sakral dan meriah. Menampilkan tarian sakral, olahraga tradisional, dan Belimbur.',
                en: 'A sacred and festive traditional ceremony of the Kutai Kartanegara Ing Martadipura Sultanate. Featuring sacred dances, traditional sports, and Belimbur.'
            },
            location: 'Tenggarong',
            date: '2026-09-20',
            imageUrl: 'https://images.unsplash.com/photo-1516083692465-27a5d092d640?q=80&w=1000&auto=format&fit=crop', // Cultural
            category: 'Culture',
            tags: ['Culture', 'History', 'Festival'],
            price: 'Free',
            organizer: 'Dispar Kukar'
        }
    });

    const ebiff = await prisma.event.create({
        data: {
            title: { id: 'East Borneo International Folklore Festival (EBIFF)', en: 'East Borneo International Folklore Festival (EBIFF)' },
            description: {
                id: 'Festival pertukaran budaya internasional di Samarinda yang mengundang seniman dari berbagai negara untuk menampilkan tarian dan musik rakyat.',
                en: 'International cultural exchange festival in Samarinda inviting artists from various countries to showcase folk dance and music.'
            },
            location: 'Samarinda',
            date: '2026-07-25',
            imageUrl: 'https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?q=80&w=1000&auto=format&fit=crop', // Performance
            category: 'Festival',
            tags: ['International', 'Dance', 'Art'],
            price: 'Free',
            organizer: 'Pemprov Kaltim'
        }
    });

    const lomPlai = await prisma.event.create({
        data: {
            title: { id: 'Festival Lom Plai (Pesta Panen Wehea)', en: 'Lom Plai Festival (Wehea Harvest Feast)' },
            description: {
                id: 'Ritual syukur panen padi masyarakat Dayak Wehea. Rangkaian acara meliputi Ngesea Egung, tarian di atas rakit (Jengea), dan Embob Jengea.',
                en: 'Rice harvest thanksgiving ritual of the Dayak Wehea community. Events include Ngesea Egung, raft dancing (Jengea), and Embob Jengea.'
            },
            location: 'Muara Wahau, Kutai Timur',
            date: '2026-03-18',
            imageUrl: 'https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?q=80&w=1000&auto=format&fit=crop', // Traditional Tribe
            category: 'Culture',
            tags: ['Dayak', 'Harvest', 'Ritual'],
            price: 'Free',
            organizer: 'Lembaga Adat Wehea'
        }
    });

    const hudoq = await prisma.event.create({
        data: {
            title: { id: 'Hudoq Pekayang', en: 'Hudoq Pekayang' },
            description: {
                id: 'Upacara topeng Hudoq untuk memohon kesuburan tanah. Penari mengenakan topeng kayu dan kostum daun pisang, menari mengelilingi desa.',
                en: 'Hudoq mask ceremony to pray for soil fertility. Dancers wear wooden masks and banana leaf costumes, dancing around the village.'
            },
            location: 'Mahakam Ulu',
            date: '2026-10-20',
            imageUrl: 'https://images.unsplash.com/photo-1599579165971-c06dc7e22037?q=80&w=1000&auto=format&fit=crop', // Mask/Costume
            category: 'Culture',
            tags: ['Mask', 'Dance', 'Spiritual'],
            price: 'Free',
            organizer: 'Dispar Mahakam Ulu'
        }
    });

    const balikpapanFest = await prisma.event.create({
        data: {
            title: { id: 'Balikpapan Fest 2026', en: 'Balikpapan Fest 2026' },
            description: {
                id: 'Pesta rakyat tahunan Balikpapan menyambut Hari Pariwisata Dunia. Fashion carnival, kuliner nusantara, dan konser musik di tepi pantai.',
                en: 'Annual Balikpapan people\'s party welcoming World Tourism Day. Fashion carnival, archipelago culinary, and seaside music concerts.'
            },
            location: 'Balikpapan',
            date: '2026-09-26',
            imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop', // Concert/Crowd
            category: 'Festival',
            tags: ['Modern', 'Music', 'Food'],
            price: 'IDR 50.000',
            organizer: 'Disporapar Balikpapan'
        }
    });

    // --- Bookings ---
    console.log('🎟️ Creating Bookings...');

    // Past Booking (Completed)
    await prisma.booking.create({
        data: {
            userId: client.id,
            packageId: derawan.id,
            productType: 'Package',
            productName: 'Eksotis Derawan 4H3M',
            productImage: derawan.imageUrl,
            location: derawan.location,
            amount: 3500000,
            date: new Date('2025-12-10'),
            status: 'completed',
            totalPax: 1,
            adultCount: 1,
            childCount: 0,
            paymentMethod: 'Credit Card',
        },
    });

    // Upcoming Booking (Paid)
    await prisma.booking.create({
        data: {
            userId: client.id,
            packageId: labuan.id,
            productType: 'Package',
            productName: 'Labuan Cermin & Whaleshark',
            productImage: labuan.imageUrl,
            location: labuan.location,
            amount: 5600000, // 2 pax
            date: new Date('2026-03-15'),
            status: 'paid',
            totalPax: 2,
            adultCount: 2,
            childCount: 0,
            paymentMethod: 'Bank Transfer (BCA)',
            travelers: [
                { name: 'Dian Sastro', idType: 'KTP', idNumber: '6471010101010001' },
                { name: 'Nicholas Saputra', idType: 'KTP', idNumber: '3171010101010002' }
            ]
        },
    });

    // Pending Booking
    await prisma.booking.create({
        data: {
            userId: client.id,
            eventId: erau.id,
            productType: 'Event',
            productName: 'Festival Erau 2026 - VIP Seat',
            productImage: erau.imageUrl,
            location: erau.location,
            amount: 150000,
            date: new Date('2026-09-20'),
            status: 'pending',
            totalPax: 1,
            adultCount: 1,
            childCount: 0,
        },
    });

    // --- Chat Session ---
    console.log('💬 Creating Chat...');
    const chat = await prisma.chatSession.create({
        data: {
            userId: client.id,
            status: 'open',
        }
    });

    await prisma.message.createMany({
        data: [
            { sessionId: chat.id, senderId: client.id, content: 'Halo, apakah trip Derawan tersedia untuk bulan depan?', isAdmin: false, read: true, createdAt: new Date(Date.now() - 10000000) },
            { sessionId: chat.id, senderId: null, content: 'Halo Kak Dian! Tentu, untuk bulan depan masih ada slot di tanggal 15 dan 20. Mau tanggal berapa?', isAdmin: true, read: true, createdAt: new Date(Date.now() - 9000000) },
            { sessionId: chat.id, senderId: client.id, content: 'Oke saya diskusikan dulu ya kak.', isAdmin: false, read: true, createdAt: new Date(Date.now() - 8000000) },
        ]
    });


    console.log('✅ Seeding completed! Login with: user@example.com / password123');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

