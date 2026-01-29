import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    // Protect Dashboard Routes
    if (pathname.startsWith('/dashboard')) {
        if (!token) {
            // Redirect to login if no token found
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('callbackUrl', pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    // Optional: Prevent logged in users from visiting login/register pages
    if ((pathname === '/login' || pathname === '/register') && token) {
        return NextResponse.redirect(new URL('/dashboard/client', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/login',
        '/register'
    ],
};
