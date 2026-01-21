import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { sendSuccess, sendError } from '@/lib/api-response';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const event = await prisma.event.findUnique({
        where: { id: String(id) },
      });

      if (!event) {
        return sendError(res, 404, 'Event not found');
      }
      
      const eventWithJson = {
          ...event,
          tags: JSON.parse(event.tags),
          schedule: event.schedule ? JSON.parse(event.schedule) : [],
          gallery: event.gallery ? JSON.parse(event.gallery) : []
      };

      return sendSuccess(res, eventWithJson);
    } catch (error) {
      return sendError(res, 500, 'Error fetching event');
    }
  } else if (req.method === 'PUT') {
      // Validate Admin/Mitra
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) return sendError(res, 401, 'Unauthorized');
      const token = authHeader.split(' ')[1];
      const decoded = verifyToken(token);
      if (!decoded || (decoded as any).role === 'client') return sendError(res, 403, 'Forbidden');

      try {
          const { title, location, date, description, imageUrl, category, tags, price, organizer, ticketCount, schedule, gallery } = req.body;
          
          const event = await prisma.event.update({
              where: { id: String(id) },
              data: {
                  title, location, date, description, imageUrl, category,
                  tags: tags ? JSON.stringify(tags) : undefined,
                  price, organizer, ticketCount: Number(ticketCount),
                  schedule: schedule ? JSON.stringify(schedule) : undefined,
                  gallery: gallery ? JSON.stringify(gallery) : undefined
              }
          });
          return sendSuccess(res, event, 'Event updated');
      } catch (error) {
          return sendError(res, 500, 'Error updating event');
      }
  } else if (req.method === 'DELETE') {
      // Validate Admin/Mitra
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) return sendError(res, 401, 'Unauthorized');
      const token = authHeader.split(' ')[1];
      const decoded = verifyToken(token);
      if (!decoded || (decoded as any).role === 'client') return sendError(res, 403, 'Forbidden');

      try {
          await prisma.event.delete({ where: { id: String(id) } });
          return sendSuccess(res, null, 'Event deleted');
      } catch (error) {
          return sendError(res, 500, 'Error deleting event');
      }
  } else {
    return sendError(res, 405, 'Method not allowed');
  }
}
