import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ message: 'Booking ID is required' });
    }

    if (req.method === 'GET') {
        try {
            const booking = await prisma.booking.findUnique({
                where: { id },
                include: {
                    user: { select: { id: true, name: true, email: true } },
                    event: true,
                    package: { include: { itinerary: true } }
                }
            });

            if (!booking) {
                return res.status(404).json({ message: 'Booking not found' });
            }

            return res.status(200).json(booking);
        } catch (error) {
            console.error('Error fetching booking:', error);
            return res.status(500).json({ message: 'Error fetching booking' });
        }
    }

    if (req.method === 'PUT') {
        try {
            const data = req.body;

            const booking = await prisma.booking.update({
                where: { id },
                data: {
                    ...data,
                    updatedAt: new Date()
                },
                include: {
                    user: { select: { id: true, name: true, email: true } },
                    event: true,
                    package: true
                }
            });

            return res.status(200).json(booking);
        } catch (error) {
            console.error('Error updating booking:', error);
            return res.status(500).json({ message: 'Error updating booking' });
        }
    }

    if (req.method === 'DELETE') {
        try {
            const booking = await prisma.booking.findUnique({
                where: { id }
            });

            if (!booking) {
                return res.status(404).json({ message: 'Booking not found' });
            }

            // Decrease booked count
            if (booking.eventId) {
                await prisma.event.update({
                    where: { id: booking.eventId },
                    data: { bookedCount: { decrement: booking.totalPax } }
                });
            }
            if (booking.packageId) {
                await prisma.tourPackage.update({
                    where: { id: booking.packageId },
                    data: { bookedCount: { decrement: booking.totalPax } }
                });
            }

            await prisma.booking.delete({
                where: { id }
            });

            return res.status(200).json({ message: 'Booking cancelled successfully' });
        } catch (error) {
            console.error('Error deleting booking:', error);
            return res.status(500).json({ message: 'Error deleting booking' });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
