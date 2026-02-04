import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { verify } from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    let userId: string;
    try {
        const decoded: any = verify(token, process.env.JWT_SECRET || 'fallback-secret');
        userId = decoded.userId;
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }

    if (req.method === 'GET') {
        try {
            const addresses = await prisma.address.findMany({
                where: { userId },
                orderBy: { isDefault: 'desc' }
            });
            return res.status(200).json(addresses);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching addresses' });
        }
    }

    if (req.method === 'POST') {
        try {
            const { label, recipientName, phone, address, city, postalCode, isDefault } = req.body;

            // If setting as default, unset others first
            if (isDefault) {
                await prisma.address.updateMany({
                    where: { userId },
                    data: { isDefault: false }
                });
            }

            const newAddress = await prisma.address.create({
                data: {
                    userId,
                    label,
                    recipientName,
                    phone,
                    address,
                    city,
                    postalCode,
                    isDefault: isDefault || false
                }
            });
            return res.status(201).json(newAddress);
        } catch (error) {
            return res.status(500).json({ message: 'Error creating address' });
        }
    }

    if (req.method === 'PUT') {
        try {
            const { id, label, recipientName, phone, address, city, postalCode, isDefault } = req.body;

            // Verify ownership
            const existing = await prisma.address.findUnique({ where: { id } });
            if (!existing || existing.userId !== userId) {
                return res.status(404).json({ message: 'Address not found' });
            }

            if (isDefault) {
                await prisma.address.updateMany({
                    where: { userId },
                    data: { isDefault: false }
                });
            }

            const updated = await prisma.address.update({
                where: { id },
                data: { label, recipientName, phone, address, city, postalCode, isDefault }
            });
            return res.status(200).json(updated);
        } catch (error) {
            return res.status(500).json({ message: 'Error updating address' });
        }
    }

    if (req.method === 'DELETE') {
        try {
            const { id } = req.query;
            if (!id || typeof id !== 'string') return res.status(400).json({ message: 'ID required' });

            const existing = await prisma.address.findUnique({ where: { id } });
            if (!existing || existing.userId !== userId) {
                return res.status(404).json({ message: 'Address not found' });
            }

            await prisma.address.delete({ where: { id } });
            return res.status(200).json({ message: 'Address deleted' });
        } catch (error) {
            return res.status(500).json({ message: 'Error deleting address' });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
