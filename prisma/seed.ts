
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding categories...');

    const categories = [
        {
            imageUrl: 'https://images.unsplash.com/photo-1596401057633-565652b5d249?auto=format&fit=crop&q=80',
            name: { id: 'Wisata Pulau', en: 'Island Expedition' },
            icon: '🏝️',
        },
        {
            imageUrl: 'https://images.unsplash.com/photo-1448375240586-dfd8d395ea6c?auto=format&fit=crop&q=80',
            name: { id: 'Hutan Tropis', en: 'Jungle Trekking' },
            icon: '🌳',
        },
        {
            imageUrl: 'https://images.unsplash.com/photo-1542385151-efd9000d8def?auto=format&fit=crop&q=80',
            name: { id: 'Budaya Lokal', en: 'Cultural Heritage' },
            icon: '👺',
        },
        {
            imageUrl: 'https://images.unsplash.com/photo-1510797215324-95aa89f43c33?auto=format&fit=crop&q=80',
            name: { id: 'Satwa Liar', en: 'Wildlife Tracking' },
            icon: '🦧',
        },
        {
            imageUrl: 'https://images.unsplash.com/photo-1582967788606-a171f1080cae?auto=format&fit=crop&q=80',
            name: { id: 'Menyelam', en: 'Diving Spots' },
            icon: '🤿',
        },
    ];

    for (const cat of categories) {
        const existing = await prisma.category.findFirst({
            where: { imageUrl: cat.imageUrl }
        });

        if (!existing) {
            await prisma.category.create({
                data: {
                    name: cat.name,
                    icon: cat.icon,
                    imageUrl: cat.imageUrl,
                },
            });
            console.log(`Created category: ${cat.name.en}`);
        } else {
            console.log(`Category already exists: ${cat.name.en}`);
        }
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
