import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ message: 'Event ID is required' });
    }

    if (req.method === 'GET') {
        try {
            const event = await prisma.event.findUnique({
                where: { id },
                include: { bookings: true }
            });

            if (!event) {
                return res.status(404).json({ message: 'Event not found' });
            }

            return res.status(200).json(event);
        } catch (error) {
            console.error('Error fetching event:', error);
            return res.status(500).json({ message: 'Error fetching event' });
        }
    }

    if (req.method === 'PUT') {
        try {
            const data = req.body;

            const event = await prisma.event.update({
                where: { id },
                data: {
                    ...data,
                    updatedAt: new Date()
                }
            });

            return res.status(200).json(event);
        } catch (error) {
            console.error('Error updating event:', error);
            return res.status(500).json({ message: 'Error updating event' });
        }
    }

    if (req.method === 'DELETE') {
        try {
            // Delete related bookings first
            await prisma.booking.deleteMany({
                where: { eventId: id }
            });

            await prisma.event.delete({
                where: { id }
            });

            return res.status(200).json({ message: 'Event deleted successfully' });
        } catch (error) {
            console.error('Error deleting event:', error);
            return res.status(500).json({ message: 'Error deleting event' });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
