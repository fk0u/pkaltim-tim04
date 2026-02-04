import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ message: 'User ID is required' });
    }

    if (req.method === 'GET') {
        try {
            const user = await prisma.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    onboardingCompleted: true,
                    preferences: true,
                    createdAt: true,
                    updatedAt: true,
                    bookings: {
                        include: {
                            event: true,
                            package: true
                        },
                        orderBy: { createdAt: 'desc' }
                    }
                }
            });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.status(200).json(user);
        } catch (error) {
            console.error('Error fetching user:', error);
            return res.status(500).json({ message: 'Error fetching user' });
        }
    }

    if (req.method === 'PUT') {
        try {
            const { password, ...data } = req.body;

            // Hash password if provided
            const updateData: any = { ...data, updatedAt: new Date() };
            if (password) {
                updateData.password = await hashPassword(password);
            }

            const user = await prisma.user.update({
                where: { id },
                data: updateData,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    onboardingCompleted: true,
                    preferences: true,
                    createdAt: true,
                    updatedAt: true
                }
            });

            return res.status(200).json(user);
        } catch (error) {
            console.error('Error updating user:', error);
            return res.status(500).json({ message: 'Error updating user' });
        }
    }

    if (req.method === 'DELETE') {
        try {
            // Delete related bookings first
            await prisma.booking.deleteMany({
                where: { userId: id }
            });

            await prisma.user.delete({
                where: { id }
            });

            return res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            console.error('Error deleting user:', error);
            return res.status(500).json({ message: 'Error deleting user' });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
