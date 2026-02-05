import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'GET') {
        const { status } = req.query;

        try {
            const whereClause = status ? { status: String(status) } : {};

            const partners = await prisma.partnerProfile.findMany({
                where: whereClause,
                include: {
                    user: {
                        select: { name: true, email: true, avatar: true }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });

            return res.status(200).json(partners);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    } else if (req.method === 'PATCH') {
        const { userId, status, rejectionReason } = req.body;

        if (!userId || !status) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        try {
            const updated = await prisma.partnerProfile.update({
                where: { userId },
                data: {
                    status,
                    rejectionReason: status === 'rejected' ? rejectionReason : null
                }
            });

            // Optional: Send email notification here

            return res.status(200).json(updated);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Failed to update status' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'PATCH']);
        res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
}
