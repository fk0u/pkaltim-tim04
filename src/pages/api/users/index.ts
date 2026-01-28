import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'GET') {
        try {
            const { role } = req.query;

            const where: any = {};
            if (role && typeof role === 'string') {
                where.role = role;
            }

            const users = await prisma.user.findMany({
                where,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    onboardingCompleted: true,
                    preferences: true,
                    createdAt: true,
                    updatedAt: true,
                    _count: { select: { bookings: true } }
                },
                orderBy: { createdAt: 'desc' }
            });
            return res.status(200).json(users);
        } catch (error) {
            console.error('Error fetching users:', error);
            return res.status(500).json({ message: 'Error fetching users' });
        }
    }

    if (req.method === 'POST') {
        try {
            const { name, email, password, role, preferences } = req.body;

            if (!name || !email || !password) {
                return res.status(400).json({ message: 'Name, email, and password are required' });
            }

            const existing = await prisma.user.findUnique({ where: { email } });
            if (existing) {
                return res.status(400).json({ message: 'User already exists with this email' });
            }

            const hashedPassword = await hashPassword(password);

            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    role: role || 'client',
                    preferences: preferences || null
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    onboardingCompleted: true,
                    preferences: true,
                    createdAt: true
                }
            });

            return res.status(201).json(user);
        } catch (error) {
            console.error('Error creating user:', error);
            return res.status(500).json({ message: 'Error creating user' });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
