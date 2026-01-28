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
            console.error('Error fetching testimonials:', error);
            return res.status(500).json({ message: 'Error fetching testimonials' });
        }
    }

    if (req.method === 'POST') {
        try {
            const { name, role, avatarUrl, rating, content } = req.body;

            if (!name || !role || !avatarUrl || !rating || !content) {
                return res.status(400).json({ message: 'All fields are required' });
            }

            const testimonial = await prisma.testimonial.create({
                data: { name, role, avatarUrl, rating, content }
            });

            return res.status(201).json(testimonial);
        } catch (error) {
            console.error('Error creating testimonial:', error);
            return res.status(500).json({ message: 'Error creating testimonial' });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
