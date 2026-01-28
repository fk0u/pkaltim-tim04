import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'GET') {
        try {
            const { active } = req.query;

            const where: any = {};
            if (active === 'true') {
                where.isActive = true;
                where.validUntil = { gte: new Date() };
            }

            const vouchers = await prisma.voucher.findMany({
                where,
                orderBy: { createdAt: 'desc' }
            });
            return res.status(200).json(vouchers);
        } catch (error) {
            console.error('Error fetching vouchers:', error);
            return res.status(500).json({ message: 'Error fetching vouchers' });
        }
    }

    if (req.method === 'POST') {
        try {
            const {
                code, discount, description, validFrom, validUntil,
                usageLimit, isActive
            } = req.body;

            if (!code || !discount || !validFrom || !validUntil) {
                return res.status(400).json({ message: 'Code, discount, validFrom, and validUntil are required' });
            }

            // Check if code already exists
            const existing = await prisma.voucher.findUnique({ where: { code } });
            if (existing) {
                return res.status(400).json({ message: 'Voucher code already exists' });
            }

            const voucher = await prisma.voucher.create({
                data: {
                    code: code.toUpperCase(),
                    discount,
                    description,
                    validFrom: new Date(validFrom),
                    validUntil: new Date(validUntil),
                    usageLimit: usageLimit || 0,
                    usedCount: 0,
                    isActive: isActive !== false
                }
            });

            return res.status(201).json(voucher);
        } catch (error) {
            console.error('Error creating voucher:', error);
            return res.status(500).json({ message: 'Error creating voucher' });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
