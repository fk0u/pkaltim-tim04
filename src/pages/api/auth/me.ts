import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { verifyToken, hashPassword } from '@/lib/auth'; // Import hashPassword
import { sendSuccess, sendError } from '@/lib/api-response';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Validate Auth
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 401, 'Unauthorized');
  }
  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  if (!decoded || typeof decoded === 'string') {
    return sendError(res, 401, 'Invalid token');
  }
  const userId = decoded.userId;

  if (req.method === 'GET') {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            onboardingCompleted: true,
            preferences: true,
            createdAt: true
        }
      });

      if (!user) return sendError(res, 404, 'User not found');

      return sendSuccess(res, {
        ...user,
        preferences: user.preferences ? JSON.parse(user.preferences) : null
      });
    } catch (error) {
      return sendError(res, 500, 'Error fetching profile');
    }
  } else if (req.method === 'PUT') {
      try {
          const { name, email, password, preferences, onboardingCompleted } = req.body;
          
          const dataToUpdate: any = {};
          if (name) dataToUpdate.name = name;
          if (email) dataToUpdate.email = email;
          if (password) dataToUpdate.password = await hashPassword(password);
          if (preferences) dataToUpdate.preferences = JSON.stringify(preferences);
          if (typeof onboardingCompleted === 'boolean') dataToUpdate.onboardingCompleted = onboardingCompleted;

          const updatedUser = await prisma.user.update({
              where: { id: userId },
              data: dataToUpdate,
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                onboardingCompleted: true,
                preferences: true,
                createdAt: true
            }
          });
          
          return sendSuccess(res, {
              ...updatedUser,
              preferences: updatedUser.preferences ? JSON.parse(updatedUser.preferences) : null
          }, 'Profile updated');

      } catch (error) {
          return sendError(res, 500, 'Error updating profile');
      }
  } else {
    return sendError(res, 405, 'Method not allowed');
  }
}
