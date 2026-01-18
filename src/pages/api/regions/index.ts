import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const regions = await prisma.region.findMany();
      const regionsWithJson = regions.map(r => ({
          ...r,
          coordinates: { lat: r.latitude, lng: r.longitude },
          destinations: JSON.parse(r.destinations)
      }));
      res.status(200).json(regionsWithJson);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching regions' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
