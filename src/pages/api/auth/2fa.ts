import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// Note: 2FA functionality is stubbed out for presentation
// To enable: npm install otplib, then uncomment full implementation

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(401).json({ message: 'Invalid token' });
    }
    const userId = decoded.userId;

    if (req.method === 'POST') {
        const { action } = req.body;

        try {
            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (!user) return res.status(404).json({ message: 'User not found' });

            if (action === 'setup') {
                // 2FA setup - stubbed for presentation
                return res.status(200).json({
                    message: '2FA feature coming soon',
                    secret: 'DEMO_SECRET_KEY',
                    otpauth: 'otpauth://totp/BorneoTrip:demo@example.com?secret=DEMO&issuer=BorneoTrip'
                });
            }

            if (action === 'verify') {
                // 2FA verify - stubbed for presentation
                return res.status(200).json({ message: '2FA Enabled (Demo Mode)' });
            }

            if (action === 'disable') {
                await prisma.user.update({
                    where: { id: userId },
                    data: {
                        isTwoFactorEnabled: false,
                        twoFactorSecret: null
                    }
                });
                return res.status(200).json({ message: '2FA Disabled' });
            }

            return res.status(400).json({ message: 'Invalid action' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    if (req.method === 'GET') {
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { isTwoFactorEnabled: true }
            });
            return res.status(200).json({ isTwoFactorEnabled: user?.isTwoFactorEnabled || false });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
}
