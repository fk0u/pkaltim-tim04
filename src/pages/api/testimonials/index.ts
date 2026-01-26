import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const testimonials = await prisma.testimonial.findMany();
      return res.status(200).json(testimonials);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error fetching testimonials' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
