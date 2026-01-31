
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
    await prisma.region.deleteMany(); // If applicable

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

    // --- Events ---
    console.log('📅 Creating Events...');
    const erau = await prisma.event.create({
        data: {
            title: { id: 'Festival Erau 2026', en: 'Erau Festival 2026' },
            description: {
                id: 'Upacara adat Kesultanan Kutai Kartanegara Ing Martadipura yang sakral dan meriah.',
                en: 'A sacred and festive traditional ceremony of the Kutai Kartanegara Ing Martadipura Sultanate.'
            },
            location: 'Tenggarong',
            date: '2026-09-20',
            imageUrl: 'https://images.unsplash.com/photo-1579290074697-3f303f90b2b8?q=80&w=1000&auto=format&fit=crop', // Cultural
            category: 'Culture',
            tags: ['Culture', 'History', 'Festival'],
            price: 'Free',
            organizer: 'Dispar Kukar'
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

