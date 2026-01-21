import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL
})

async function main() {
  console.log('Dropping database...');
  try {
    // Drop all tables is safer than dropping DB if user user has no privileges to CREATE DB
    // But since it's root, DROP DB is fine.
    // However, the connection string connects TO the db. Dropping it while connected might be tricky?
    // Usually standard practice is to connect to 'mysql' or 'sys' to drop.
    // But let's try dropping the tables dynamically.
    
    // Disable FK checks
    await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 0;');
    
    const tables: any[] = await prisma.$queryRaw`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'borneotrip_db';
    `;

    for (const { TABLE_NAME } of tables) {
        if (TABLE_NAME !== '_prisma_migrations') {
            await prisma.$executeRawUnsafe(`DROP TABLE \`${TABLE_NAME}\`;`);
            console.log(`Dropped ${TABLE_NAME}`);
        }
    }
    
    // Drop migration table too
    await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS `_prisma_migrations`;');
    
    await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 1;');
    console.log('Database cleaned.');
  } catch (e) {
    console.error(e);
  } finally {
      await prisma.$disconnect();
  }
}

main();
