import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { sendSuccess, sendError } from '@/lib/api-response';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Validate Auth
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 401, 'Unauthorized');
  }
  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  if (!decoded || typeof decoded === 'string') {
    return sendError(res, 401, 'Invalid token');
  }
  const userId = decoded.userId;

  if (req.method === 'GET') {
    try {
      const bookings = await prisma.booking.findMany({
        where: { userId }, // Only show own bookings unless admin (TODO)
        include: {
            event: true,
            package: true
        },
        orderBy: { date: 'desc' }
      });
      return sendSuccess(res, bookings);
    } catch (error) {
      console.error(error);
      return sendError(res, 500, 'Error fetching bookings');
    }
  } else if (req.method === 'POST') {
    const { eventId, packageId } = req.body;
    
    if (!eventId && !packageId) {
        return sendError(res, 400, 'Must provide eventId or packageId');
    }

    try {
        const booking = await prisma.booking.create({
            data: {
                userId,
                eventId,
                packageId,
                status: 'pending'
            }
        });
        return sendSuccess(res, booking, 'Booking created successfully');
    } catch (error) {
        console.error(error);
        return sendError(res, 500, 'Error creating booking');
    }
  } else {
    return sendError(res, 405, 'Method not allowed');
  }
}
