import type { NextApiRequest, NextApiResponse } from 'next';
import { removeCookie } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Clear the cookie
    removeCookie(res, 'token');
    res.status(200).json({ message: 'Logged out successfully' });
}
