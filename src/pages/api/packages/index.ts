import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const packages = await prisma.tourPackage.findMany({
        where: { status: 'approved' },
        include: { itinerary: true },
        orderBy: { createdAt: 'desc' }
      });
<<<<<<< HEAD
      
      const packagesWithJson = packages.map(p => ({
        ...p,
        facilities: p.facilities ? JSON.parse(p.facilities) : [],
        itinerary: p.itinerary ? {
            ...p.itinerary,
            badges: p.itinerary.badges ? JSON.parse(p.itinerary.badges) : [],
            days: p.itinerary.days ? JSON.parse(p.itinerary.days) : []
        } : null
      }));

      res.status(200).json(packagesWithJson);
=======
      return res.status(200).json(packages);
>>>>>>> 332fc3d2c0ba159299a2ec965f3ed464edf8bd18
    } catch (error) {
      console.error('Error fetching packages:', error);
      return res.status(500).json({ message: 'Error fetching packages' });
    }
<<<<<<< HEAD
  } else if (req.method === 'POST') {
    const user = verifyToken(req);
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    const { 
        title, duration, price, location, rating, ecoRating, 
        description, imageUrl, facilities, itinerary 
    } = req.body;

    if (!title || !price || !location) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const pkg = await prisma.tourPackage.create({
            data: {
                title,
                duration,
                price: typeof price === 'string' ? parseInt(price) : price,
                location,
                rating: typeof rating === 'string' ? parseFloat(rating) : rating,
                ecoRating: typeof ecoRating === 'string' ? parseInt(ecoRating) : ecoRating,
                description,
                imageUrl,
                facilities: facilities ? JSON.stringify(facilities) : '[]',
                itinerary: itinerary ? {
                    create: {
                        title: itinerary.title,
                        badges: itinerary.badges ? JSON.stringify(itinerary.badges) : '[]',
                        days: itinerary.days ? JSON.stringify(itinerary.days) : '[]',
                    }
                } : undefined
            },
            include: { itinerary: true }
        });
        
        return res.status(201).json(pkg);
    } catch (error) {
        console.error('Create package error:', error);
        return res.status(500).json({ message: 'Error creating package' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
=======
>>>>>>> 332fc3d2c0ba159299a2ec965f3ed464edf8bd18
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
