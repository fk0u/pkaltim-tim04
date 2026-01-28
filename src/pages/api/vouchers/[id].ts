import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ message: 'Voucher ID is required' });
    }

    if (req.method === 'GET') {
        try {
            const voucher = await prisma.voucher.findUnique({
                where: { id }
            });

            if (!voucher) {
                return res.status(404).json({ message: 'Voucher not found' });
            }

            return res.status(200).json(voucher);
        } catch (error) {
            console.error('Error fetching voucher:', error);
            return res.status(500).json({ message: 'Error fetching voucher' });
        }
    }

    if (req.method === 'PUT') {
        try {
            const { validFrom, validUntil, ...data } = req.body;

            const voucher = await prisma.voucher.update({
                where: { id },
                data: {
                    ...data,
                    validFrom: validFrom ? new Date(validFrom) : undefined,
                    validUntil: validUntil ? new Date(validUntil) : undefined,
                    updatedAt: new Date()
                }
            });

            return res.status(200).json(voucher);
        } catch (error) {
            console.error('Error updating voucher:', error);
            return res.status(500).json({ message: 'Error updating voucher' });
        }
    }

    if (req.method === 'DELETE') {
        try {
            await prisma.voucher.delete({
                where: { id }
            });

            return res.status(200).json({ message: 'Voucher deleted successfully' });
        } catch (error) {
            console.error('Error deleting voucher:', error);
            return res.status(500).json({ message: 'Error deleting voucher' });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
