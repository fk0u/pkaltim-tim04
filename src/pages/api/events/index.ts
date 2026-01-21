import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { sendSuccess, sendError } from '@/lib/api-response';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { category, search } = req.query;
      
      const where: any = {};
      if (category) where.category = String(category);
      if (search) {
          where.OR = [
              { title: { contains: String(search) } }, // Remove mode: 'insensitive' for MySQL default collation
              { description: { contains: String(search) } }
          ];
      }

      const events = await prisma.event.findMany({
          where,
          orderBy: { date: 'asc' }
      });
      
      const eventsWithJson = events.map(e => ({
        ...e,
        tags: JSON.parse(e.tags),
        schedule: e.schedule ? JSON.parse(e.schedule) : [],
        gallery: e.gallery ? JSON.parse(e.gallery) : []
      }));
      
      return sendSuccess(res, eventsWithJson);
    } catch (error) {
      console.error(error);
      return sendError(res, 500, 'Error fetching events');
    }
  } else if (req.method === 'POST') {
     // Validate Admin/Mitra
     const authHeader = req.headers.authorization;
     if (!authHeader || !authHeader.startsWith('Bearer ')) {
       return sendError(res, 401, 'Unauthorized');
     }
     const token = authHeader.split(' ')[1];
     const decoded = verifyToken(token);
     if (!decoded || (decoded as any).role === 'client') {
       return sendError(res, 403, 'Forbidden');
     }

     try {
         const { title, location, date, description, imageUrl, category, tags, price, organizer, ticketCount, schedule, gallery } = req.body;
         
         const event = await prisma.event.create({
             data: {
                 title, location, date, description, imageUrl, category,
                 tags: JSON.stringify(tags || []),
                 price, organizer, ticketCount: Number(ticketCount),
                 schedule: JSON.stringify(schedule || []),
                 gallery: JSON.stringify(gallery || [])
             }
         });
         return sendSuccess(res, event, 'Event created');
     } catch (error) {
         return sendError(res, 500, 'Error creating event');
     }
  } else {
    return sendError(res, 405, 'Method not allowed');
  }
}
