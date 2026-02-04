import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { code, amount } = req.body;

    if (!code) {
        return res.status(400).json({ message: 'Voucher code is required' });
    }

    try {
        const voucher = await prisma.voucher.findUnique({
            where: { code: code.toUpperCase() }
        });

        if (!voucher) {
            return res.status(404).json({
                valid: false,
                message: 'Voucher code not found'
            });
        }

        const now = new Date();

        // Check if voucher is active
        if (!voucher.isActive) {
            return res.status(400).json({
                valid: false,
                message: 'This voucher is no longer active'
            });
        }

        // Check if voucher is within valid date range
        if (now < voucher.validFrom) {
            return res.status(400).json({
                valid: false,
                message: 'This voucher is not yet valid'
            });
        }

        if (now > voucher.validUntil) {
            return res.status(400).json({
                valid: false,
                message: 'This voucher has expired'
            });
        }

        // Check usage limit (0 = unlimited)
        if (voucher.usageLimit > 0 && voucher.usedCount >= voucher.usageLimit) {
            return res.status(400).json({
                valid: false,
                message: 'This voucher has reached its usage limit'
            });
        }

        // Calculate discount
        const discountAmount = amount ? Math.round((amount * voucher.discount) / 100) : 0;
        const finalAmount = amount ? amount - discountAmount : 0;

        return res.status(200).json({
            valid: true,
            voucher: {
                id: voucher.id,
                code: voucher.code,
                discount: voucher.discount,
                description: voucher.description
            },
            calculation: amount ? {
                originalAmount: amount,
                discountPercentage: voucher.discount,
                discountAmount,
                finalAmount
            } : null
        });
    } catch (error) {
        console.error('Error validating voucher:', error);
        return res.status(500).json({ message: 'Error validating voucher' });
    }
}
