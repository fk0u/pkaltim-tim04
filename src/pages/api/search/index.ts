import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { type = 'event', location = '', priceMax, rating } = req.query;

    try {
        const searchType = (type as string).toLowerCase();
        const searchLocation = (location as string).trim();

        if (searchType === 'package') {
            const whereClause: any = {};

            if (searchLocation) {
                whereClause.location = {
                    contains: searchLocation,
                };
            }

            if (priceMax) {
                whereClause.price = {
                    lte: Number(priceMax)
                };
            }

            if (rating) {
                whereClause.rating = {
                    gte: Number(rating)
                };
            }

            const packages = await prisma.tourPackage.findMany({
                where: whereClause,
                orderBy: { createdAt: 'desc' },
            });

            return res.status(200).json(packages);
        } else {
            // Event Search
            const whereClause: any = {};

            if (searchLocation) {
                whereClause.location = {
                    contains: searchLocation,
                };
            }

            const events = await prisma.event.findMany({
                where: whereClause,
                orderBy: { date: 'asc' }
            });

            return res.status(200).json(events);
        }

    } catch (error) {
        console.error('Error searching:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
