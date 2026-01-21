import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { hashPassword, generateToken } from '@/lib/auth';
import { sendSuccess, sendError } from '@/lib/api-response';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return sendError(res, 405, 'Method not allowed');
  }

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return sendError(res, 400, 'All fields are required');
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return sendError(res, 400, 'Email already registered');
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        onboardingCompleted: false, // Default
      },
    });

    // Generate token for immediate login
    const token = generateToken({ userId: user.id, email: user.email, role: user.role });

    return sendSuccess(res, {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token
    }, 'Registration successful');
  } catch (error) {
    console.error('Register error:', error);
    return sendError(res, 500, 'Internal server error');
  }
}
