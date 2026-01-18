import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { name, email, password, role } = req.body;
    
    if (!email || !password || !name) {
        return res.status(400).json({ message: 'Missing fields' });
    }

    try {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) return res.status(400).json({ message: 'User already exists' });
      
      const user = await prisma.user.create({
        data: { 
            name, 
            email, 
            password, // NOTE: Hash this in production
            role: role || 'client' 
        }
      });
      
      return res.status(200).json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
