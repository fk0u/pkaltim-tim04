import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { verify } from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded: any = verify(token, process.env.JWT_SECRET || 'fallback-secret');
        const userId = decoded.userId;

        const { name, email, phone, bio, idNumber } = req.body;

        // Email update usually requires verification, so we might skip it or handle carefully. 
        // For now, allow name, phone. Bio and idNumber might need schema update if they don't exist.
        // Checking schema... User model usually has name, email, password, role.
        // If fields are missing in DB, we can't update them without schema change.
        // Plan said "Update user profile (name, phone, NIK, bio)".
        // I need to check schema.prisma first to see if these fields exist.
        // If not, I'll store what I can or assume schema update was done? 
        // The previous task checklist said "Schema Update (Category model)" but didn't mention User model extensions for Bio/Phone/NIK.
        // I will check schema in next step. For now, I will write the code assuming they might be there or I will add them to schema if missing.
        // To be safe, I will just update 'name' and maybe 'email' for now, and check schema immediately after.

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                name,
                // phone, // Check schema first
                // bio, // Check schema first
                // idNumber // Check schema first
            }
        });

        res.status(200).json({ message: 'Profile updated', user: updatedUser });

    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
