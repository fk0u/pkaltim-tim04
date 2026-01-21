import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { sendSuccess, sendError } from '@/lib/api-response';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { minPrice, maxPrice, ecoRating } = req.query;
      
      const where: any = {};
      if (minPrice || maxPrice) {
          where.price = {};
          if (minPrice) where.price.gte = Number(minPrice);
          if (maxPrice) where.price.lte = Number(maxPrice);
      }
      if (ecoRating) where.ecoRating = { gte: Number(ecoRating) };

      const packages = await prisma.tourPackage.findMany({
        where,
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

      return sendSuccess(res, packagesWithJson);
    } catch (error) {
      console.error(error);
      return sendError(res, 500, 'Error fetching packages');
    }
  } else if (req.method === 'POST') {
     // Validate Mitra/Admin
     const authHeader = req.headers.authorization;
     if (!authHeader || !authHeader.startsWith('Bearer ')) {
       return sendError(res, 401, 'Unauthorized');
     }
     const token = authHeader.split(' ')[1];
     const decoded = verifyToken(token);
     if (!decoded || (decoded as any).role === 'client') {
       return sendError(res, 403, 'Forbidden');
     }

     try {
         const { title, duration, price, location, rating, ecoRating, description, imageUrl, facilities } = req.body;
         
         const pkg = await prisma.tourPackage.create({
             data: {
                 title, duration, price: Number(price), location, rating: Number(rating), ecoRating: Number(ecoRating), description, imageUrl,
                 facilities: JSON.stringify(facilities || [])
             }
         });
         return sendSuccess(res, pkg, 'Package created');
     } catch (error) {
         return sendError(res, 500, 'Error creating package');
     }
  } else {
    return sendError(res, 405, 'Method not allowed');
  }
}
