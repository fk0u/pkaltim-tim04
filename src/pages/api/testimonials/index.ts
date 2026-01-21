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
      const testimonials = await prisma.testimonial.findMany();
      return sendSuccess(res, testimonials);
    } catch (error) {
      return sendError(res, 500, 'Error fetching testimonials');
    }
  } else if (req.method === 'POST') {
    // Validate Auth
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return sendError(res, 401, 'Unauthorized');
    }
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (!decoded) return sendError(res, 401, 'Invalid token');

    const { content, rating } = req.body;
    if (!content || !rating) return sendError(res, 400, 'Missing fields');

    try {
        const user = await prisma.user.findUnique({ where: { id: (decoded as any).userId }});
        if (!user) return sendError(res, 404, 'User not found');

        const testimonial = await prisma.testimonial.create({
            data: {
                name: user.name,
                role: 'Traveler', // Default role
                avatarUrl: `https://ui-avatars.com/api/?name=${user.name}`, // Auto avatar
                rating: Number(rating),
                content
            }
        });
        return sendSuccess(res, testimonial);
    } catch (error) {
        return sendError(res, 500, 'Error creating testimonial');
    }
  } else {
    return sendError(res, 405, 'Method not allowed');
  }
}
