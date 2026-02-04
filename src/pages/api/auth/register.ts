import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
<<<<<<< HEAD
import bcrypt from 'bcryptjs';
=======
import { hashPassword, generateToken, setCookie } from '@/lib/auth';
>>>>>>> 332fc3d2c0ba159299a2ec965f3ed464edf8bd18

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
<<<<<<< HEAD

  const { name, email, password, role } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: 'User already exists' });
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { 
        name, 
        email, 
        password: hashedPassword,
        role: role || 'client' 
      }
    });
    
    // Exclude password from response
    const { password: _, ...userWithoutPassword } = user;
    
    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('Register error:', error);
=======

  const { name, email, password, role } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  // Validate password length
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'client',
        onboardingCompleted: false
      }
    });

    const token = generateToken({ userId: user.id, email: user.email, role: user.role });

    // Set HttpOnly Cookie
    setCookie(res, 'token', token);

    // Don't send password in response
    const { password: _, ...userWithoutPassword } = user;

    return res.status(201).json({
      user: userWithoutPassword,
      // Token is in cookie
    });
  } catch (error) {
    console.error('Registration error:', error);
>>>>>>> 332fc3d2c0ba159299a2ec965f3ed464edf8bd18
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
