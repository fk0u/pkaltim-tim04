import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getServerSession } from '@/lib/session';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res);
    if (!session || session.role !== 'admin') {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.method === 'GET') {
        try {
            const settings = await prisma.systemSetting.findMany();
            // Convert array to object { key: value }
            const settingsMap: Record<string, any> = {};
            settings.forEach(s => {
                try {
                    settingsMap[s.key] = JSON.parse(s.value);
                } catch {
                    settingsMap[s.key] = s.value;
                }
            });
            return res.status(200).json(settingsMap);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching settings' });
        }
    }

    if (req.method === 'POST') {
        try {
            const updates = req.body; // { key: value, key2: value2 }
            const promises = Object.entries(updates).map(([key, value]) => {
                const valStr = typeof value === 'object' ? JSON.stringify(value) : String(value);
                return prisma.systemSetting.upsert({
                    where: { key },
                    update: { value: valStr },
                    create: { key, value: valStr }
                });
            });

            await Promise.all(promises);
            return res.status(200).json({ message: 'Settings saved' });
        } catch (error) {
            return res.status(500).json({ message: 'Error saving settings' });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
