import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const events = await prisma.event.findMany({
        orderBy: { createdAt: 'desc' }
      });
      // Parse JSON fields
      const eventsWithJson = events.map(e => ({
        ...e,
        tags: e.tags ? JSON.parse(e.tags) : [],
        schedule: e.schedule ? JSON.parse(e.schedule) : [],
        gallery: e.gallery ? JSON.parse(e.gallery) : []
      }));
      res.status(200).json(eventsWithJson);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching events' });
    }
  } else if (req.method === 'POST') {
    const user = verifyToken(req);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Optional: Check role
    // if (user.role !== 'admin' && user.role !== 'mitra') {
    //   return res.status(403).json({ message: 'Forbidden' });
    // }

    const { 
      title, location, date, description, imageUrl, category, 
      tags, price, organizer, ticketCount, schedule, gallery 
    } = req.body;

    if (!title || !location || !date) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
      const event = await prisma.event.create({
        data: {
          title,
          location,
          date,
          description,
          imageUrl,
          category,
          tags: tags ? JSON.stringify(tags) : '[]',
          price,
          organizer,
          ticketCount: ticketCount ? parseInt(ticketCount) : 0,
          schedule: schedule ? JSON.stringify(schedule) : '[]',
          gallery: gallery ? JSON.stringify(gallery) : '[]',
        }
      });
      return res.status(201).json(event);
    } catch (error) {
      console.error('Create event error:', error);
      return res.status(500).json({ message: 'Error creating event' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
