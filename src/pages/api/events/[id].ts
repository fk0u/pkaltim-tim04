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

  if (req.method === 'GET') {
    try {
      const event = await prisma.event.findUnique({
        where: { id },
      });

      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      const eventWithJson = {
        ...event,
        tags: event.tags ? JSON.parse(event.tags) : [],
        schedule: event.schedule ? JSON.parse(event.schedule) : [],
        gallery: event.gallery ? JSON.parse(event.gallery) : [],
      };

      return res.status(200).json(eventWithJson);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
  } 
  
  // Protected routes
  const user = verifyToken(req);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'PUT') {
    const { 
        title, location, date, description, imageUrl, category, 
        tags, price, organizer, ticketCount, schedule, gallery 
    } = req.body;

    try {
      const event = await prisma.event.update({
        where: { id },
        data: {
            title,
            location,
            date,
            description,
            imageUrl,
            category,
            tags: tags ? JSON.stringify(tags) : undefined,
            price,
            organizer,
            ticketCount: ticketCount ? parseInt(ticketCount) : undefined,
            schedule: schedule ? JSON.stringify(schedule) : undefined,
            gallery: gallery ? JSON.stringify(gallery) : undefined,
        },
      });
      return res.status(200).json(event);
    } catch (error) {
      console.error('Update event error:', error);
      return res.status(500).json({ message: 'Error updating event' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.event.delete({
        where: { id },
      });
      return res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
      console.error('Delete event error:', error);
      return res.status(500).json({ message: 'Error deleting event' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
