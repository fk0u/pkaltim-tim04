import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { type } = req.query;

      const where: any = {};
      if (type && typeof type === 'string') {
        where.type = type;
      }

      const regions = await prisma.region.findMany({
        where,
        orderBy: { name: 'asc' }
      });

      // Transform to match frontend expected format
      const formattedRegions = regions.map(r => ({
        ...r,
        coordinates: { lat: r.latitude, lng: r.longitude }
      }));

      return res.status(200).json(formattedRegions);
    } catch (error) {
      console.error('Error fetching regions:', error);
      return res.status(500).json({ message: 'Error fetching regions' });
    }
  }

  if (req.method === 'POST') {
    try {
      const {
        name, type, capital, leader, area, population, density,
        districts, villages, latitude, longitude, imageUrl, destinations
      } = req.body;

      if (!name || !type || !latitude || !longitude) {
        return res.status(400).json({ message: 'Name, type, latitude, and longitude are required' });
      }

      const region = await prisma.region.create({
        data: {
          name, type, capital, leader, area, population, density,
          districts, villages, latitude, longitude, imageUrl,
          destinations: destinations || []
        }
      });

      return res.status(201).json({
        ...region,
        coordinates: { lat: region.latitude, lng: region.longitude }
      });
    } catch (error) {
      console.error('Error creating region:', error);
      return res.status(500).json({ message: 'Error creating region' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
