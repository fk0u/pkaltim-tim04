import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getServerSession } from '@/lib/session';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const session = await getServerSession(req, res);
    if (!session) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const { name, email, phone, bio, idNumber, preferences, onboardingCompleted, avatar } = req.body;

        // Construct update data dynamically to avoid overwriting with undefined
        const updateData: any = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (phone !== undefined) updateData.phone = phone;
        if (bio !== undefined) updateData.bio = bio;
        if (idNumber !== undefined) updateData.idNumber = idNumber;
        if (onboardingCompleted !== undefined) updateData.onboardingCompleted = onboardingCompleted;

        // Handle preferences merging if avatar is provided or preferences are updated
        if (preferences || avatar) {
            // We need current preferences to merge if we are just adding avatar
            const currentUser = await prisma.user.findUnique({
                where: { id: session.id },
                select: { preferences: true }
            });

            const currentPrefs = (currentUser?.preferences as any) || {};
            let newPrefs = { ...currentPrefs };

            if (preferences) {
                newPrefs = { ...newPrefs, ...preferences };
            }
            if (avatar) {
                newPrefs.avatar = avatar;
            }

            updateData.preferences = newPrefs;
        }

        const updatedUser = await prisma.user.update({
            where: { id: session.id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                onboardingCompleted: true,
                phone: true,
                bio: true,
                idNumber: true,
                preferences: true,
                createdAt: true
            }
        });

        res.status(200).json({ message: 'Profile updated', user: updatedUser });

    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
