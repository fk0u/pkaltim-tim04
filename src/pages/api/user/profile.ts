import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = verifyToken(req);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'PUT') {
      const { name, preferences, onboardingCompleted } = req.body;

      try {
          const updatedUser = await prisma.user.update({
              where: { id: user.userId },
              data: {
                  name,
                  onboardingCompleted: onboardingCompleted !== undefined ? onboardingCompleted : undefined,
                  preferences: preferences ? JSON.stringify(preferences) : undefined
              }
          });
          
          const { password: _, ...userWithoutPassword } = updatedUser;
          
          return res.status(200).json(userWithoutPassword);
      } catch (error) {
          console.error('Update profile error:', error);
          return res.status(500).json({ message: 'Error updating profile' });
      }
  } else {
      res.status(405).json({ message: 'Method not allowed' });
  }
}
