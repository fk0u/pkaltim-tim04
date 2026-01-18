import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { userId, preferences } = req.body;

  if (!userId || !preferences) {
    return res.status(400).json({ message: 'Missing userId or preferences' });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        preferences: JSON.stringify(preferences),
        onboardingCompleted: true,
      },
    });

    // Validasi bahwa respons tidak mengandung BigInt sebelum dikirim
    const safeUser = JSON.parse(JSON.stringify(updatedUser, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));

    return res.status(200).json(safeUser);
  } catch (error) {
    console.error('Update preferences error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
