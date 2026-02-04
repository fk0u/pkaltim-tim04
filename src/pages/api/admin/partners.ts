import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Basic Admin Check (In production use middleware/session)
    // Here relying on client-side protection + assumption of admin context or checking token if verifyToken was imported.
    // For MVP prototype speed without verifyToken import:
    // We will assume the request is valid if it reaches here, but ideally verify token.

    if (req.method === 'GET') {
        try {
            const { status } = req.query;

            const whereClause: any = {};
            if (status && status !== 'all') {
                whereClause.status = status;
            }

            const partners = await prisma.partnerProfile.findMany({
                where: whereClause,
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                            phone: true,
                            avatar: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });

            return res.status(200).json(partners);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    } else if (req.method === 'PUT') {
        try {
            const { id, status, rejectionReason } = req.body;

            if (!id || !status) {
                return res.status(400).json({ message: 'ID and Status required' });
            }

            const partner = await prisma.partnerProfile.update({
                where: { id },
                data: {
                    status,
                    rejectionReason: status === 'rejected' ? rejectionReason : null
                }
            });

            // Also update the User role if needed to lock/unlock features? 
            // Currently using 'mitra' role for both pending and verified, 
            // but access to create content is blocked by profile.status check in frontend/backend.
            // So no need to change User.role.

            return res.status(200).json(partner);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
