import { PrismaClient } from '@prisma/client';
import { EVENTS, PACKAGES, REGIONS, TESTIMONIALS } from '../src/data/mockData';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Seed Regions
  for (const region of REGIONS) {
    const exists = await prisma.region.findFirst({ where: { name: region.name } });
    if (!exists) {
        await prisma.region.create({
            data: {
                name: region.name,
                type: region.type,
                capital: region.capital,
                leader: region.leader,
                area: region.area,
                population: region.population,
                density: region.density,
                districts: region.districts,
                villages: region.villages,
                latitude: region.coordinates.lat,
                longitude: region.coordinates.lng,
                imageUrl: region.imageUrl,
                destinations: JSON.stringify(region.destinations)
            }
        });
    }
  }

  // Seed Events
  for (const event of EVENTS) {
    const exists = await prisma.event.findFirst({ where: { title: event.title } });
    if (!exists) {
        await prisma.event.create({
            data: {
                title: event.title,
                location: event.location,
                date: event.date,
                description: event.description,
                imageUrl: event.imageUrl,
                category: event.category,
                tags: JSON.stringify(event.tags),
                price: event.price,
                organizer: event.organizer,
                ticketCount: event.ticketCount,
                schedule: JSON.stringify(event.schedule),
                gallery: JSON.stringify(event.gallery)
            }
        });
    }
  }

  // Seed Packages
  for (const pkg of PACKAGES) {
      const exists = await prisma.tourPackage.findFirst({ where: { title: pkg.title } });
      if (!exists) {
         await prisma.tourPackage.create({
             data: {
                 title: pkg.title,
                 duration: pkg.duration,
                 price: pkg.price,
                 location: pkg.location,
                 rating: pkg.rating,
                 ecoRating: pkg.ecoRating,
                 description: pkg.description,
                 imageUrl: pkg.imageUrl,
                 facilities: JSON.stringify(pkg.facilities),
                 // Note: Itinerary seeding omitted for simplicity or can be added if needed,
                 // assuming mockData structure matches or adapting it.
                 // Checking ITINERARY_DETAILS from mockData if available globally or import.
                 // For now, simple package.
             }
         });
      }
  }

  // Seed Testimonials
  for (const testimony of TESTIMONIALS) {
      const exists = await prisma.testimonial.findFirst({ where: { name: testimony.name } });
      if (!exists) {
          await prisma.testimonial.create({
              data: {
                  name: testimony.name,
                  role: testimony.role,
                  avatarUrl: testimony.avatarUrl,
                  rating: testimony.rating,
                  content: testimony.content
              }
          });
      }
  }
  
  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
