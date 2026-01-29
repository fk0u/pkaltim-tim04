import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (req.method === 'PUT') {
        try {
            const { name, icon, imageUrl } = req.body;
            const category = await prisma.category.update({
                where: { id: String(id) },
                data: {
                    name,
                    icon,
                    imageUrl,
                },
            });
            res.status(200).json(category);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update category' });
        }
    } else if (req.method === 'DELETE') {
        try {
            await prisma.category.delete({
                where: { id: String(id) },
            });
            res.status(200).json({ message: 'Category deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete category' });
        }
    } else {
        res.setHeader('Allow', ['PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
