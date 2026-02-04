import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Admin Check (Simplified)

    if (req.method === 'GET') {
        try {
            const { type } = req.query; // 'event' or 'package' or 'all'

            let events = [];
            // let packages = [];

            if (type === 'event' || !type || type === 'all') {
                events = await prisma.event.findMany({
                    where: { status: 'pending' },
                    include: {
                        organizerUser: {
                            select: { name: true, email: true, partnerProfile: { select: { businessName: true } } }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                });
            }

            // Future: Fetch packages if implemented

            return res.status(200).json({ events });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    } else if (req.method === 'PUT') {
        try {
            const { id, type, status, adminNote } = req.body;

            if (!id || !type || !status) {
                return res.status(400).json({ message: 'ID, Type, and Status required' });
            }

            if (type === 'event') {
                const event = await prisma.event.update({
                    where: { id },
                    data: {
                        status,
                        adminNote: status === 'rejected' ? adminNote : null
                    }
                });
                return res.status(200).json(event);
            }

            // if (type === 'package') ...

            return res.status(400).json({ message: 'Invalid type' });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
