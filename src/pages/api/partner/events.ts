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
            const events = await prisma.event.findMany({
                where: { organizerId: String(userId) },
                orderBy: { createdAt: 'desc' }
            });
            return res.status(200).json(events);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    } else if (req.method === 'POST') {
        try {
            const {
                title, location, date, description, imageUrl, category,
                price, quota, organizerId
            } = req.body;

            // Validate Partner Status
            // In a real app, verify the token and check if user.partnerProfile.status === 'verified'
            // Here assuming frontend guard + simple backend check if desired, but for speed:

            const partner = await prisma.partnerProfile.findUnique({
                where: { userId: organizerId }
            });

            if (!partner) {
                return res.status(403).json({ message: 'Partner profile not found' });
            }

            if (partner.status !== 'verified') {
                return res.status(403).json({ message: 'Partner not verified. Cannot create events.' });
            }

            const event = await prisma.event.create({
                data: {
                    title: { id: title, en: title }, // Simplified localization
                    location,
                    date: new Date(date).toISOString(), // Handle date format
                    description: { id: description, en: description },
                    imageUrl,
                    category,
                    price: String(price),
                    quota: parseInt(quota),
                    ticketCount: 0,
                    tags: [],
                    organizerId,
                    status: 'pending' // Default to pending
                }
            });

            return res.status(201).json(event);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
