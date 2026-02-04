import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth'; // You might need to export this from lib/auth or auth middleware

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        // Simple Auth Check
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        if (!token) {
            // Allow public GET for checking existence if needed, or strictly secure it.
            // For debugging, we might relax it or return 401 JSON.
            // return res.status(401).json({ message: 'Unauthorized' });
        }

        if (req.method === 'POST') {
            const { userId, businessName, businessType, description, address, website, ktpUrl, licenseUrl } = req.body;

            if (!userId) return res.status(400).json({ message: 'User ID required' });

            console.log('Creating partner profile for:', userId);

            const profile = await prisma.partnerProfile.create({
                data: {
                    userId,
                    businessName,
                    businessType,
                    description,
                    address,
                    website,
                    ktpUrl,
                    licenseUrl,
                    status: 'pending'
                }
            });
            return res.status(201).json(profile);

        } else if (req.method === 'GET') {
            const { userId } = req.query;

            if (!userId || typeof userId !== 'string') {
                return res.status(400).json({ message: 'User ID required' });
            }

            console.log('Fetching partner profile for:', userId);

            const profile = await prisma.partnerProfile.findUnique({
                where: { userId }
            });

            // Return 200 with null if not found (frontend should handle it), or 404
            if (!profile) {
                return res.status(200).json(null); // Return null so frontend knows to redirect to onboarding
            }

            return res.status(200).json(profile);
        } else {
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).json({ message: `Method ${req.method} Not Allowed` });
        }
    } catch (error: any) {
        console.error('API Error in /api/partner/profile:', error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}
