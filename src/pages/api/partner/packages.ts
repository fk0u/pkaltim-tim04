import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'GET') {
        const { userId } = req.query;
        if (!userId) return res.status(400).json({ message: 'User ID required' });

        try {
            const packages = await prisma.tourPackage.findMany({
                where: { organizerId: String(userId) },
                orderBy: { createdAt: 'desc' }
            });
            return res.status(200).json(packages);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    } else if (req.method === 'POST') {
        try {
            const {
                title, location, duration, price, quota, description,
                imageUrl, facilities, itineraryDays, organizerId
            } = req.body;

            // Validate Partner (Should be middleware/helper)
            const partner = await prisma.partnerProfile.findUnique({
                where: { userId: organizerId }
            });

            if (!partner || partner.status !== 'verified') {
                return res.status(403).json({ message: 'Partner not verified.' });
            }

            const tourPackage = await prisma.tourPackage.create({
                data: {
                    title: { id: title, en: title },
                    location,
                    duration,
                    price: parseInt(price),
                    quota: parseInt(quota),
                    bookedCount: 0,
                    rating: 0,
                    ecoRating: 5, // Default
                    description: { id: description, en: description },
                    imageUrl,
                    facilities: facilities || [],
                    organizerId,
                    status: 'pending',
                    itinerary: {
                        create: {
                            title: `Itinerary for ${title}`,
                            badges: [],
                            days: itineraryDays || []
                        }
                    }
                }
            });

            return res.status(201).json(tourPackage);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
