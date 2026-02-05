import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ message: 'Invalid ID' });
    }

    if (req.method === 'GET') {
        try {
            const pkg = await prisma.tourPackage.findUnique({
                where: { id },
                include: { itinerary: true }
            });
            if (!pkg) return res.status(404).json({ message: 'Not Found' });
            return res.status(200).json(pkg);
        } catch (error) {
            return res.status(500).json({ message: 'Internal Error' });
        }
    } else if (req.method === 'DELETE') {
        try {
            await prisma.tourPackage.delete({ where: { id } });
            return res.status(200).json({ message: 'Deleted' });
        } catch (error) {
            return res.status(500).json({ message: 'Failed to delete' });
        }
    } else if (req.method === 'PUT') {
        try {
            const { title, location, duration, price, quota, description, imageUrl, facilities, itineraryDays } = req.body;

            const updated = await prisma.tourPackage.update({
                where: { id },
                data: {
                    title: { id: title, en: title }, // Simplified for MVP
                    location,
                    duration,
                    price: parseInt(price),
                    quota: parseInt(quota),
                    description: { id: description, en: description }, // Simplified
                    imageUrl,
                    facilities,
                    // Note: Itinerary update is complex in Prisma. 
                    // Strategy: Delete existing days and re-create.
                    itinerary: {
                        update: {
                            days: itineraryDays
                        }
                    }
                }
            });
            return res.status(200).json(updated);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Failed to update' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
