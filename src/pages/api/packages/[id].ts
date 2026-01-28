import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ message: 'Package ID is required' });
    }

    if (req.method === 'GET') {
        try {
            const tourPackage = await prisma.tourPackage.findUnique({
                where: { id },
                include: {
                    itinerary: true,
                    bookings: true
                }
            });

            if (!tourPackage) {
                return res.status(404).json({ message: 'Package not found' });
            }

            return res.status(200).json(tourPackage);
        } catch (error) {
            console.error('Error fetching package:', error);
            return res.status(500).json({ message: 'Error fetching package' });
        }
    }

    if (req.method === 'PUT') {
        try {
            const { itinerary, ...packageData } = req.body;

            // Update package
            const tourPackage = await prisma.tourPackage.update({
                where: { id },
                data: {
                    ...packageData,
                    updatedAt: new Date()
                }
            });

            // Update itinerary if provided
            if (itinerary) {
                await prisma.itineraryDetail.upsert({
                    where: { packageId: id },
                    update: {
                        title: itinerary.title,
                        badges: itinerary.badges,
                        days: itinerary.days
                    },
                    create: {
                        packageId: id,
                        title: itinerary.title,
                        badges: itinerary.badges || [],
                        days: itinerary.days || []
                    }
                });
            }

            const updatedPackage = await prisma.tourPackage.findUnique({
                where: { id },
                include: { itinerary: true }
            });

            return res.status(200).json(updatedPackage);
        } catch (error) {
            console.error('Error updating package:', error);
            return res.status(500).json({ message: 'Error updating package' });
        }
    }

    if (req.method === 'DELETE') {
        try {
            // Delete related bookings first
            await prisma.booking.deleteMany({
                where: { packageId: id }
            });

            // Itinerary will be cascade deleted due to schema relation
            await prisma.tourPackage.delete({
                where: { id }
            });

            return res.status(200).json({ message: 'Package deleted successfully' });
        } catch (error) {
            console.error('Error deleting package:', error);
            return res.status(500).json({ message: 'Error deleting package' });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
