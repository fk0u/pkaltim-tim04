import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
<<<<<<< HEAD
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
=======
import { verifyPassword, generateToken, setCookie } from '@/lib/auth';
>>>>>>> 332fc3d2c0ba159299a2ec965f3ed464edf8bd18

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
<<<<<<< HEAD
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Exclude password
    const { password: _, ...userWithoutPassword } = user;
    
    return res.status(200).json({ 
      token,
      user: userWithoutPassword 
=======
    // Verify user exists and password is correct using Database
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isValid = await verifyPassword(password, user.password);

    if (!isValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken({ userId: user.id, email: user.email, role: user.role });

    // Set HttpOnly Cookie
    setCookie(res, 'token', token);

    // Don't send password in response
    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({
      user: userWithoutPassword,
      // Token is now in cookie, no need to send back
>>>>>>> 332fc3d2c0ba159299a2ec965f3ed464edf8bd18
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
