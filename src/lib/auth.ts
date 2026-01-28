import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'borneotrip-secret-key';

export interface JwtPayload {
    userId: string;
    email: string;
    role: string;
}

export interface AuthenticatedRequest extends NextApiRequest {
    user?: JwtPayload;
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
}

/**
 * Compare password with hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

/**
 * Generate JWT token
 */
export function generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): JwtPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch {
        return null;
    }
}

/**
 * Middleware to authenticate requests
 */
export function withAuth(
    handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>,
    requiredRole?: string | string[]
) {
    return async (req: AuthenticatedRequest, res: NextApiResponse) => {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        const token = authHeader.substring(7);
        const payload = verifyToken(token);

        if (!payload) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }

        // Check role if required
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

/**
 * Optional auth - doesn't fail if no token, but attaches user if present
 */
export function withOptionalAuth(
    handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>
) {
    return async (req: AuthenticatedRequest, res: NextApiResponse) => {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const payload = verifyToken(token);
            if (payload) {
                req.user = payload;
            }
        }

        return handler(req, res);
    };
}
