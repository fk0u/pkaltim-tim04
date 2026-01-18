import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    // Backdoor for demo/mock accounts (if needed, otherwise rely on DB)
    if (email === 'admin@borneotrip.id' && password === 'admin123') {
        return res.status(200).json({
            id: 'mock-admin',
            name: 'Super Admin',
            email,
            role: 'admin',
        });
    }

    try {
      const user = await prisma.user.findUnique({ where: { email } });
      
      // Simple plain text comparison for prototype as requested
      if (!user || user.password !== password) {
          return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      return res.status(200).json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
