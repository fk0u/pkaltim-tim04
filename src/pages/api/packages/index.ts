import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const packages = await prisma.tourPackage.findMany({
        include: { itinerary: true },
        orderBy: { createdAt: 'desc' }
      });
      return res.status(200).json(packages);
    } catch (error) {
      console.error('Error fetching packages:', error);
      return res.status(500).json({ message: 'Error fetching packages' });
    }
  }

  if (req.method === 'POST') {
    try {
      const {
        title, duration, price, priceChild, quota, bookedCount,
        location, rating, ecoRating, description, imageUrl,
        facilities, itinerary
      } = req.body;

      if (!title || !duration || !price || !location || !description || !imageUrl) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const tourPackage = await prisma.tourPackage.create({
        data: {
          title,
          duration,
          price,
          priceChild,
          quota: quota || 0,
          bookedCount: bookedCount || 0,
          location,
          rating: rating || 0,
          ecoRating: ecoRating || 3,
          description,
          imageUrl,
          facilities: facilities || [],
          itinerary: itinerary ? {
            create: {
              title: itinerary.title,
              badges: itinerary.badges || [],
              days: itinerary.days || []
            }
          } : undefined
        },
        include: { itinerary: true }
      });

      return res.status(201).json(tourPackage);
    } catch (error) {
      console.error('Error creating package:', error);
      return res.status(500).json({ message: 'Error creating package' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
