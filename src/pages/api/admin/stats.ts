import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { sendSuccess, sendError } from '@/lib/api-response';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Validate Admin
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 401, 'Unauthorized');
  }
  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  if (!decoded || typeof decoded === 'string' || (decoded as any).role !== 'admin') {
    return sendError(res, 403, 'Forbidden');
  }

  if (req.method === 'GET') {
    try {
      // Parallel queries for performance
      const [
          totalUsers,
          newUsersThisMonth,
          totalBookings,
          pendingBookings,
          totalRevenue,
          popularPackages
      ] = await Promise.all([
          prisma.user.count(),
          prisma.user.count({
              where: {
                  createdAt: {
                      gte: new Date(new Date().setDate(1)) // 1st of this month
                  }
              }
          }),
          prisma.booking.count(),
          prisma.booking.count({ where: { status: 'pending' } }),
          prisma.booking.findMany({
              where: { status: 'confirmed' }, // Assuming only confirmed counts
              include: { package: true, event: true } // Need price
          }),
          prisma.booking.groupBy({
              by: ['packageId'],
              _count: { packageId: true },
              orderBy: { _count: { packageId: 'desc' } },
              take: 5
          })
      ]);

      // Calculate revenue manually since price is in related tables and stored as int/string
      let revenue = 0;
      totalRevenue.forEach(b => {
          if (b.package) revenue += b.package.price;
          // Events might be free or have price string
      });

      // Get names for popular packages
      const popularPackageDetails = await Promise.all(
          popularPackages
            .filter(p => p.packageId) // filter nulls
            .map(async (p) => {
              const pkg = await prisma.tourPackage.findUnique({ where: { id: p.packageId! } });
              return { 
                  name: pkg?.title || 'Unknown',
                  count: p._count.packageId 
              };
          })
      );

      return sendSuccess(res, {
          users: { total: totalUsers, new: newUsersThisMonth },
          bookings: { total: totalBookings, pending: pendingBookings },
          revenue,
          popularPackages: popularPackageDetails
      });

    } catch (error) {
      console.error(error);
      return sendError(res, 500, 'Error fetching stats');
    }
  } else {
    return sendError(res, 405, 'Method not allowed');
  }
}
