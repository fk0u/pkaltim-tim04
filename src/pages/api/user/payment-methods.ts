import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getServerSession } from '@/lib/session';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // 1. Auth Check
    const session = await getServerSession(req, res);
    if (!session) return res.status(401).json({ message: 'Unauthorized' });
    const userId = session.id;

    if (req.method === 'GET') {
        try {
            const methods = await prisma.paymentMethod.findMany({
                where: { userId, isActive: true },
                orderBy: { createdAt: 'desc' }
            });
            return res.status(200).json(methods);
        } catch (error) {
            return res.status(500).json({ message: 'Failed to fetch payment methods' });
        }
    }

    if (req.method === 'POST') {
        try {
            const { provider, last4, brand, holder, expiry } = req.body;

            // Simple validation
            if (!provider || !holder) return res.status(400).json({ message: 'Missing fields' });

            const newMethod = await prisma.paymentMethod.create({
                data: {
                    userId,
                    provider, // 'card', 'wallet'
                    last4,
                    brand,    // 'visa', 'mastercard', 'gopay'
                    holder,
                    expiry
                }
            });
            return res.status(201).json(newMethod);
        } catch (error) {
            return res.status(500).json({ message: 'Failed to save payment method' });
        }
    }

    if (req.method === 'DELETE') {
        try {
            const { id } = req.query;
            if (typeof id !== 'string') return res.status(400).json({ message: 'Invalid ID' });

            // Verify ownership
            const count = await prisma.paymentMethod.count({
                where: { id, userId }
            });

            if (count === 0) return res.status(404).json({ message: 'Method not found' });

            await prisma.paymentMethod.delete({
                where: { id }
            });

            return res.status(200).json({ message: 'Deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Failed to delete' });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
