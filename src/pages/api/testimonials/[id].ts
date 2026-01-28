import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ message: 'Testimonial ID is required' });
    }

    if (req.method === 'GET') {
        try {
            const testimonial = await prisma.testimonial.findUnique({
                where: { id }
            });

            if (!testimonial) {
                return res.status(404).json({ message: 'Testimonial not found' });
            }

            return res.status(200).json(testimonial);
        } catch (error) {
            console.error('Error fetching testimonial:', error);
            return res.status(500).json({ message: 'Error fetching testimonial' });
        }
    }

    if (req.method === 'PUT') {
        try {
            const testimonial = await prisma.testimonial.update({
                where: { id },
                data: req.body
            });

            return res.status(200).json(testimonial);
        } catch (error) {
            console.error('Error updating testimonial:', error);
            return res.status(500).json({ message: 'Error updating testimonial' });
        }
    }

    if (req.method === 'DELETE') {
        try {
            await prisma.testimonial.delete({
                where: { id }
            });

            return res.status(200).json({ message: 'Testimonial deleted successfully' });
        } catch (error) {
            console.error('Error deleting testimonial:', error);
            return res.status(500).json({ message: 'Error deleting testimonial' });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
