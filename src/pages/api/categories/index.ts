import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const categories = await prisma.category.findMany({
                orderBy: { createdAt: 'desc' }
            });
            res.status(200).json(categories);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch categories' });
        }
    } else if (req.method === 'POST') {
        try {
            const { name, icon, imageUrl } = req.body;
            const category = await prisma.category.create({
                data: {
                    name,
                    icon,
                    imageUrl,
                },
            });
            res.status(201).json(category);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create category' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
