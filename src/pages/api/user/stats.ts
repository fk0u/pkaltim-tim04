import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { verify } from 'jsonwebtoken';
import { serialize } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded: any = verify(token, process.env.JWT_SECRET || 'fallback-secret');
        const userId = decoded.userId;

        const [bookings, user] = await Promise.all([
            prisma.booking.findMany({
                where: { userId: userId },
            }),
            prisma.user.findUnique({
                where: { id: userId },
                select: { createdAt: true }
            })
        ]);

        const totalBookings = bookings.length;

        // Calculate Total Spent (only for Paid/Completed)
        const totalSpent = bookings
            .filter(b => b.status === 'Paid' || b.status === 'Completed')
            .reduce((sum, b) => sum + b.amount, 0);

        // XP Calculation: 1000 IDR = 1 XP
        const totalXP = Math.floor(totalSpent / 1000);

        // Active Trips: Pending or Confirmed/Paid but future date (simplified to just not Cancelled/Completed for now or specific statuses)
        // Assuming 'Paid' is active. 'Pending' is active. 'Completed' is done. 'Cancelled' is done.
        const activeTripsCount = bookings.filter(b => b.status === 'Paid' || b.status === 'Pending').length;

        res.status(200).json({
            totalBookings,
            totalSpent,
            totalXP,
            activeTripsCount,
            joinDate: user?.createdAt
        });

    } catch (error) {
        console.error('Stats fetch error:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
}
