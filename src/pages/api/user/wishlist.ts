import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Basic User ID simulation or extraction
    // In a real app we'd use session/token. For now, we expect userId in query or body, 
    // or we assume a header. The app seems to rely on client-side passing userId often?
    // Let's check how other APIs do it.
    // Browsing `booking/index.ts` it uses `req.query.userId` or `body.userId`.
    // I will support `req.query.userId` for GET and `req.body.userId` for POST/DELETE.

    if (req.method === 'GET') {
        const { userId } = req.query;
        if (!userId || typeof userId !== 'string') {
            return res.status(400).json({ message: 'User ID required' });
        }

        try {
            const wishlist = await prisma.wishlist.findMany({
                where: { userId },
                include: {
                    event: true,
                    package: true
                },
                orderBy: { createdAt: 'desc' }
            });
            return res.status(200).json(wishlist);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
            return res.status(500).json({ message: 'Error fetching wishlist' });
        }
    }

    if (req.method === 'POST') {
        const { userId, productId, type } = req.body;
        // type: "Event" | "Package"

        if (!userId || !productId || !type) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        try {
            const data: any = { userId };
            if (type === 'Event') data.eventId = productId;
            else if (type === 'Package') data.packageId = productId;
            else return res.status(400).json({ message: 'Invalid type' });

            // Check if exists to avoid error? Prisma `create` might fail on unique constraint?
            // Actually `upsert` or check first.
            const existing = await prisma.wishlist.findFirst({
                where: data
            });

            if (existing) {
                return res.status(200).json(existing); // Already exists, return it
            }

            const item = await prisma.wishlist.create({
                data
            });

            return res.status(201).json(item);
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            return res.status(500).json({ message: 'Error adding to wishlist' });
        }
    }

    if (req.method === 'DELETE') {
        const { userId, productId, type } = req.body; // Or query? Usually DELETE has body or path param.

        if (!userId || !productId || !type) {
            // Try query if body empty? NO, simple protocol first.
            return res.status(400).json({ message: 'Missing required fields' });
        }

        try {
            const where: any = { userId };
            if (type === 'Event') where.eventId = productId;
            else if (type === 'Package') where.packageId = productId;

            // DeleteMany is safer if multiple (shouldn't be) and easier than finding ID first
            await prisma.wishlist.deleteMany({
                where
            });

            return res.status(200).json({ message: 'Removed from wishlist' });
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            return res.status(500).json({ message: 'Error removing from wishlist' });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
