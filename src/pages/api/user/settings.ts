import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { verify } from 'jsonwebtoken';

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

    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { currency, language, notifications } = req.body;

        // Get existing user to merge preferences if needed
        const user = await prisma.user.findUnique({ where: { id: userId } });
        const existingPrefs = (user?.preferences as any) || {};

        const updatedPrefs = {
            ...existingPrefs,
            ...(currency && { currency }),
            ...(language && { language }),
            ...(notifications && { notifications: { ...existingPrefs.notifications, ...notifications } })
        };

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { preferences: updatedPrefs }
        });

        return res.status(200).json(updatedUser.preferences);
    } catch (error) {
        console.error('Error updating preferences:', error);
        return res.status(500).json({ message: 'Error updating preferences' });
    }
}
