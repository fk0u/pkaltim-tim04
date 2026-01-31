
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Connecting to database...');
    try {
        // Try to count users
        const count = await prisma.user.count();
        console.log(`User count: ${count}`);

        // Try to create a dummy user
        const email = `test_${Date.now()}@example.com`;
        console.log(`Creating user with email: ${email}`);
        const user = await prisma.user.create({
            data: {
                name: 'Test User',
                email: email,
                password: 'hashedpassword123',
                role: 'client',
                onboardingCompleted: false
            }
        });
        console.log('User created successfully:', user.id);

        // Clean up
        await prisma.user.delete({ where: { id: user.id } });
        console.log('User deleted successfully');

    } catch (error) {
        console.error('Database verification failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
