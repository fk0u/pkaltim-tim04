import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { verify } from 'jsonwebtoken';
import { authenticator } from 'otplib'; // Will need to install this

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    let userId: string;
    try {
        const decoded: any = verify(token, process.env.JWT_SECRET || 'fallback-secret');
        userId = decoded.userId;
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }

    if (req.method === 'POST') {
        const { action, token: userToken } = req.body;

        try {
            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (!user) return res.status(404).json({ message: 'User not found' });

            if (action === 'setup') {
                // Generate Secret
                const secret = authenticator.generateSecret();
                const otpauth = authenticator.keyuri(user.email, 'BorneoTrip', secret);

                // Save secret temporarily (or permanently but marked as not enabled yet? 
                // Better to save strictly when verified. But we need it for verification.
                // We will save to DB but `isTwoFactorEnabled` remains false until verify.
                await prisma.user.update({
                    where: { id: userId },
                    data: { twoFactorSecret: secret }
                });

                return res.status(200).json({ secret, otpauth });
            }

            if (action === 'verify') {
                if (!user.twoFactorSecret) return res.status(400).json({ message: 'Setup 2FA first' });

                const isValid = authenticator.check(userToken, user.twoFactorSecret);
                if (isValid) {
                    await prisma.user.update({
                        where: { id: userId },
                        data: { isTwoFactorEnabled: true }
                    });
                    return res.status(200).json({ message: '2FA Enabled' });
                } else {
                    return res.status(400).json({ message: 'Invalid Token' });
                }
            }

            if (action === 'disable') {
                await prisma.user.update({
                    where: { id: userId },
                    data: { isTwoFactorEnabled: false, twoFactorSecret: null }
                });
                return res.status(200).json({ message: '2FA Disabled' });
            }

            return res.status(400).json({ message: 'Invalid action' });

        } catch (error) {
            console.error('2FA Error:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
