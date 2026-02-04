import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    try {
        const payload = verifyToken(token);

        if (!payload || !payload.userId) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                onboardingCompleted: true,
                createdAt: true,
                phone: true,
                bio: true,
                idNumber: true,
                preferences: true
                // avatar: true -- Removed as it's not in schema
            }
        });

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Map to User interface expected by frontend
        const userData = {
            ...user,
            role: user.role as any, // Cast string to UserRole
            // Extract avatar from preferences or use default
            avatar: (user.preferences as any)?.avatar || `https://i.pravatar.cc/150?u=${user.id}`,
            joinDate: user.createdAt.toISOString().split('T')[0],
            totalSpent: 0, // Placeholder or calculate
            status: 'Active' as const,
            phone: user.phone || undefined,
            bio: user.bio || undefined,
            idNumber: user.idNumber || undefined,
            preferences: user.preferences || undefined
        };

        // Return the user data (success)
        res.status(200).json({ user: userData });
    } catch (error) {
        console.error('Session check error:', error);
        res.status(401).json({ message: 'Session invalid' });
    }
}
