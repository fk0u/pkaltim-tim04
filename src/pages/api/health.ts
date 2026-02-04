import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // fast query to check connection
        await prisma.$queryRaw`SELECT 1`;
        res.status(200).json({ status: 'ok' });
    } catch (error) {
        console.error('Database health check failed:', error);
        res.status(503).json({ status: 'error', message: 'Database unreachable' });
    }
}
