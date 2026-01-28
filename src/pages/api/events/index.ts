import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const events = await prisma.event.findMany({
        orderBy: { createdAt: 'desc' }
      });
      return res.status(200).json(events);
    } catch (error) {
      console.error('Error fetching events:', error);
      return res.status(500).json({ message: 'Error fetching events' });
    }
  }

  if (req.method === 'POST') {
    try {
      const {
        title, location, date, description, imageUrl, category,
        tags, price, priceChild, organizer, ticketCount, quota,
        bookedCount, schedule, gallery
      } = req.body;

      if (!title || !location || !date || !description || !imageUrl || !category) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const event = await prisma.event.create({
        data: {
          title,
          location,
          date,
          description,
          imageUrl,
          category,
          tags: tags || [],
          price,
          priceChild,
          organizer,
          ticketCount: ticketCount || 0,
          quota: quota || 0,
          bookedCount: bookedCount || 0,
          schedule: schedule || [],
          gallery: gallery || []
        }
      });

      return res.status(201).json(event);
    } catch (error) {
      console.error('Error creating event:', error);
      return res.status(500).json({ message: 'Error creating event' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
