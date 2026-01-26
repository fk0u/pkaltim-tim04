import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid ID' });
  }

  const user = verifyToken(req);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        event: true,
        package: true,
      }
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Authorization check
    // Admins can access all, users only their own
    if (user.role !== 'admin' && booking.userId !== user.userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    if (req.method === 'GET') {
      return res.status(200).json(booking);
    } else if (req.method === 'PUT') {
      // Only admin might change status to 'confirmed', or user to 'cancelled'
      const { status } = req.body;
      
      if (user.role !== 'admin' && status !== 'cancelled') {
         return res.status(403).json({ message: 'You can only cancel your booking' });
      }

      const updated = await prisma.booking.update({
        where: { id },
        data: { status }
      });
      return res.status(200).json(updated);
    } else if (req.method === 'DELETE') {
       if (user.role !== 'admin') {
         return res.status(403).json({ message: 'Only admin can delete bookings' });
       }
       await prisma.booking.delete({ where: { id } });
       return res.status(200).json({ message: 'Booking deleted' });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Booking operation error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
