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
      const pkg = await prisma.tourPackage.findUnique({
        where: { id },
        include: { itinerary: true }
      });

      if (!pkg) {
        return res.status(404).json({ message: 'Package not found' });
      }

      const pkgWithJson = {
        ...pkg,
        facilities: pkg.facilities ? JSON.parse(pkg.facilities) : [],
        itinerary: pkg.itinerary ? {
            ...pkg.itinerary,
            badges: pkg.itinerary.badges ? JSON.parse(pkg.itinerary.badges) : [],
            days: pkg.itinerary.days ? JSON.parse(pkg.itinerary.days) : []
        } : null
      };

      return res.status(200).json(pkgWithJson);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  const user = verifyToken(req);
  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  if (req.method === 'PUT') {
     const { 
        title, duration, price, location, rating, ecoRating, 
        description, imageUrl, facilities, itinerary 
    } = req.body;

    try {
        // Update package. Nested update for itinerary is bit complex if it doesn't exist.
        // Prisma upsert can be used for itinerary relation updates.
        
        const updateData: any = {
            title, duration, location, description, imageUrl,
            price: typeof price === 'string' ? parseInt(price) : price,
            rating: typeof rating === 'string' ? parseFloat(rating) : rating,
            ecoRating: typeof ecoRating === 'string' ? parseInt(ecoRating) : ecoRating,
            facilities: facilities ? JSON.stringify(facilities) : undefined,
        };

        if (itinerary) {
            updateData.itinerary = {
                upsert: {
                    create: {
                        title: itinerary.title || title + ' Itinerary',
                        badges: itinerary.badges ? JSON.stringify(itinerary.badges) : '[]',
                        days: itinerary.days ? JSON.stringify(itinerary.days) : '[]',
                    },
                    update: {
                        title: itinerary.title,
                        badges: itinerary.badges ? JSON.stringify(itinerary.badges) : undefined,
                        days: itinerary.days ? JSON.stringify(itinerary.days) : undefined,
                    }
                }
            };
        }

        const pkg = await prisma.tourPackage.update({
            where: { id },
            data: updateData,
            include: { itinerary: true }
        });
        
        return res.status(200).json(pkg);
    } catch (error) {
        console.error('Update package error:', error);
        return res.status(500).json({ message: 'Error updating package' });
    }
  } else if (req.method === 'DELETE') {
    try {
        await prisma.tourPackage.delete({
            where: { id }
        });
        return res.status(200).json({ message: 'Package deleted successfully' });
    } catch (error) {
        console.error('Delete package error:', error);
        return res.status(500).json({ message: 'Error deleting package' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
