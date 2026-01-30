import { NextApiRequest, NextApiResponse } from 'next';
import { sign, verify } from 'jsonwebtoken';
import { hash, compare } from 'bcryptjs';
import { serialize } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'borneotrip-secret-key';

export interface JwtPayload {
    userId: string;
    email: string;
    role: string;
}

export interface AuthenticatedRequest extends NextApiRequest {
    user?: JwtPayload;
}

export async function hashPassword(password: string) {
    return await hash(password, 12);
}

export async function verifyPassword(password: string, hashed: string) {
    return await compare(password, hashed);
}

export function generateToken(payload: object) {
    return sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
    try {
        return verify(token, JWT_SECRET) as JwtPayload;
    } catch {
        return null;
    }
}

export function setCookie(res: NextApiResponse, name: string, value: string, options: any = {}) {
    const stringValue = typeof value === 'object' ? 'j:' + JSON.stringify(value) : String(value);

    const opts = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
        sameSite: 'strict',
        ...options
    };

    res.setHeader('Set-Cookie', serialize(name, String(stringValue), opts));
}

export function removeCookie(res: NextApiResponse, name: string) {
    res.setHeader('Set-Cookie', serialize(name, '', {
        maxAge: -1,
        path: '/',
    }));
}

export function withAuth(
    handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>,
    requiredRole?: string | string[]
) {
    return async (req: AuthenticatedRequest, res: NextApiResponse) => {
        const tokenCookie = req.cookies.token;

        // Also verify header as fallback/alternative if needed, but primary is cookie now
        // const authHeader = req.headers.authorization; 

        let token = tokenCookie;
        // if (!token && authHeader && authHeader.startsWith('Bearer ')) {
        //     token = authHeader.substring(7);
        // }

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        const payload = verifyToken(token);

        if (!payload) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }

        if (requiredRole) {
            const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
            if (!roles.includes(payload.role)) {
                return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
            }
        }

        req.user = payload;
        return handler(req, res);
    };
}

export async function getServerSession(req: NextApiRequest, res: NextApiResponse) {
    const token = req.cookies.token;
    if (!token) return null;
    const payload = verifyToken(token);
    if (!payload) return null;
    return { id: payload.userId, ...payload };
}
// Force rebuild
