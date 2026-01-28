import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'GET') {
        try {
            const { userId, status } = req.query;

            const where: any = {};
            if (userId && typeof userId === 'string') {
                where.userId = userId;
            }
            if (status && typeof status === 'string') {
                where.status = status;
            }

            const bookings = await prisma.booking.findMany({
                where,
                include: {
                    user: { select: { id: true, name: true, email: true } },
                    event: true,
                    package: true
                },
                orderBy: { createdAt: 'desc' }
            });
            return res.status(200).json(bookings);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            return res.status(500).json({ message: 'Error fetching bookings' });
        }
    }

    if (req.method === 'POST') {
        try {
            const {
                userId, eventId, packageId, productType, productName, productImage,
                location, adultCount, childCount, totalPax, travelers, amount,
                status, paymentMethod
            } = req.body;

            if (!userId || (!eventId && !packageId)) {
                return res.status(400).json({ message: 'User ID and Product (event or package) ID are required' });
            }

            const booking = await prisma.booking.create({
                data: {
                    userId,
                    eventId,
                    packageId,
                    productType: productType || (eventId ? 'Event' : 'Package'),
                    productName,
                    productImage,
                    location,
                    adultCount: adultCount || 1,
                    childCount: childCount || 0,
                    totalPax: totalPax || (adultCount || 1) + (childCount || 0),
                    travelers: travelers || [],
                    amount: amount || 0,
                    status: status || 'pending',
                    paymentMethod
                },
                include: {
                    user: { select: { id: true, name: true, email: true } },
                    event: true,
                    package: true
                }
            });

            // Update booked count on event or package
            if (eventId) {
                await prisma.event.update({
                    where: { id: eventId },
                    data: { bookedCount: { increment: totalPax || 1 } }
                });
            }
            if (packageId) {
                await prisma.tourPackage.update({
                    where: { id: packageId },
                    data: { bookedCount: { increment: totalPax || 1 } }
                });
            }

            return res.status(201).json(booking);
        } catch (error) {
            console.error('Error creating booking:', error);
            return res.status(500).json({ message: 'Error creating booking' });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
