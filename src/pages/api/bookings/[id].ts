import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { sendSuccess, sendError } from '@/lib/api-response';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  
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
      const booking = await prisma.booking.findUnique({
        where: { id: String(id) },
        include: { event: true, package: true }
      });

      if (!booking) {
        return sendError(res, 404, 'Booking not found');
      }

      // Security check
      if (booking.userId !== userId && (decoded as any).role !== 'admin') {
          return sendError(res, 403, 'Forbidden');
      }

      return sendSuccess(res, booking);
    } catch (error) {
      return sendError(res, 500, 'Error fetching booking');
    }
  } else if (req.method === 'PUT') {
      try {
          const { status } = req.body;
          // Only Admin can update to any status, User might cancel (handled in UPDATE or separate)
          // For simplicity, allow user to Cancel, Admin to Confirm/Complete
          
          const booking = await prisma.booking.findUnique({ where: { id: String(id) } });
          if (!booking) return sendError(res, 404, 'Booking not found');

          if ((decoded as any).role !== 'admin' && booking.userId !== userId) {
               return sendError(res, 403, 'Forbidden');
          }

          if ((decoded as any).role !== 'admin' && status !== 'cancelled') {
              return sendError(res, 403, 'Clients can only cancel bookings');
          }

          const updatedBooking = await prisma.booking.update({
              where: { id: String(id) },
              data: { status }
          });
          return sendSuccess(res, updatedBooking, 'Booking status updated');
      } catch (error) {
          return sendError(res, 500, 'Error updating booking');
      }
  } else if (req.method === 'DELETE') {
      try {
        const booking = await prisma.booking.findUnique({ where: { id: String(id) }});
        if (!booking) return sendError(res, 404, 'Booking not found');
        
        if (booking.userId !== userId && (decoded as any).role !== 'admin') {
            return sendError(res, 403, 'Forbidden');
        }

        await prisma.booking.delete({ where: { id: String(id) } });
        return sendSuccess(res, null, 'Booking deleted');
      } catch (error) {
          return sendError(res, 500, 'Error deleting booking');
      }
  } else {
    return sendError(res, 405, 'Method not allowed');
  }
}
