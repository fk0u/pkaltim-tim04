import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = verifyToken(req);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    // If admin, show all? If user, show only theirs?
    // Let's implement generic listing, usually for admin or global view if needed.
    // For user specific booking, maybe separate endpoint or query param.
    // If role is client, return only their bookings.
    
    try {
        const whereClause = user.role === 'admin' ? {} : { userId: user.userId };
        
        const bookings = await prisma.booking.findMany({
            where: whereClause,
            include: {
                event: true,
                package: true,
                user: { select: { name: true, email: true } }
            },
            orderBy: { date: 'desc' }
        });
        return res.status(200).json(bookings);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error fetching bookings' });
    }
  } else if (req.method === 'POST') {
    const { eventId, packageId } = req.body;
    
    if (!eventId && !packageId) {
        return res.status(400).json({ message: 'Must provide eventId or packageId' });
    }

    try {
        const booking = await prisma.booking.create({
            data: {
                userId: user.userId,
                eventId,
                packageId,
                status: 'pending'
            }
        });
        return res.status(201).json(booking);
    } catch (error) {
        console.error('Booking error:', error);
        return res.status(500).json({ message: 'Error creating booking' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
