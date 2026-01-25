import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'Invalid ID' });
  }

  if (req.method === 'GET') {
    try {
      const region = await prisma.region.findUnique({
        where: { id: parseInt(id as string) },
      });

      if (!region) {
        return res.status(404).json({ message: 'Region not found' });
      }

      const regionWithJson = {
        ...region,
        coordinates: { lat: region.latitude, lng: region.longitude },
        destinations: region.destinations ? JSON.parse(region.destinations) : [],
      };

      return res.status(200).json(regionWithJson);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
