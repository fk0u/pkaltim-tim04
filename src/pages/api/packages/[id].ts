import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth'; // Import verifyToken
import { sendSuccess, sendError } from '@/lib/api-response';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const pkg = await prisma.tourPackage.findUnique({
        where: { id: String(id) },
        include: { itinerary: true }
      });

      if (!pkg) {
        return sendError(res, 404, 'Package not found');
      }
      
      const pkgWithJson = {
          ...pkg,
          facilities: JSON.parse(pkg.facilities),
          itinerary: pkg.itinerary ? {
              ...pkg.itinerary,
              badges: JSON.parse(pkg.itinerary.badges),
              days: JSON.parse(pkg.itinerary.days)
          } : null
      };

      return sendSuccess(res, pkgWithJson);
    } catch (error) {
      console.error(error);
      return sendError(res, 500, 'Error fetching package');
    }
  } else if (req.method === 'PUT') {
      // Validate Admin/Mitra
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) return sendError(res, 401, 'Unauthorized');
      const token = authHeader.split(' ')[1];
      const decoded = verifyToken(token);
      if (!decoded || (decoded as any).role === 'client') return sendError(res, 403, 'Forbidden');

      try {
          const { title, duration, price, location, rating, ecoRating, description, imageUrl, facilities } = req.body;
          
          const pkg = await prisma.tourPackage.update({
              where: { id: String(id) },
              data: {
                  title, duration, price: Number(price), location, rating: Number(rating), ecoRating: Number(ecoRating), description, imageUrl,
                  facilities: facilities ? JSON.stringify(facilities) : undefined
              }
          });
          return sendSuccess(res, pkg, 'Package updated');
      } catch (error) {
          return sendError(res, 500, 'Error updating package');
      }
  } else if (req.method === 'DELETE') {
      // Validate Admin/Mitra
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) return sendError(res, 401, 'Unauthorized');
      const token = authHeader.split(' ')[1];
      const decoded = verifyToken(token);
      if (!decoded || (decoded as any).role === 'client') return sendError(res, 403, 'Forbidden');

      try {
          await prisma.tourPackage.delete({ where: { id: String(id) } });
          return sendSuccess(res, null, 'Package deleted');
      } catch (error) {
          return sendError(res, 500, 'Error deleting package');
      }
  } else {
    return sendError(res, 405, 'Method not allowed');
  }
}
