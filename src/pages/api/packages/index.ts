import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const packages = await prisma.tourPackage.findMany({
        include: {
          itinerary: true
        }
      });
      
      const packagesWithJson = packages.map(p => ({
        ...p,
        facilities: JSON.parse(p.facilities),
        itinerary: p.itinerary ? {
            ...p.itinerary,
            badges: JSON.parse(p.itinerary.badges),
            days: JSON.parse(p.itinerary.days)
        } : null
      }));

      res.status(200).json(packagesWithJson);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching packages' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
