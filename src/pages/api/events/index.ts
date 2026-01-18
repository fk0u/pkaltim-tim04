import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const events = await prisma.event.findMany();
      // Parse JSON fields
      const eventsWithJson = events.map(e => ({
        ...e,
        tags: JSON.parse(e.tags),
        schedule: e.schedule ? JSON.parse(e.schedule) : [],
        gallery: e.gallery ? JSON.parse(e.gallery) : []
      }));
      res.status(200).json(eventsWithJson);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching events' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
