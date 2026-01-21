import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { comparePassword, generateToken } from '@/lib/auth';
import { sendSuccess, sendError } from '@/lib/api-response';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return sendError(res, 405, 'Method not allowed');
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return sendError(res, 400, 'Email and password are required');
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return sendError(res, 401, 'Invalid credentials');
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return sendError(res, 401, 'Invalid credentials');
    }

    const token = generateToken({ userId: user.id, email: user.email, role: user.role });

    return sendSuccess(res, {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        onboardingCompleted: user.onboardingCompleted,
      },
      token
    }, 'Login successful');
  } catch (error) {
    console.error('Login error:', error);
    return sendError(res, 500, 'Internal server error');
  }
}
