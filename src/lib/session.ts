import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from './auth';

export async function getServerSession(req: NextApiRequest, res: NextApiResponse) {
    const token = req.cookies.token;
    if (!token) return null;
    const payload = verifyToken(token);
    if (!payload) return null;
    return { id: payload.userId, ...payload };
}
