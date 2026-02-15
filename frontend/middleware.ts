import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // ----------------------------------------------------------------
    // 1. SITE-WIDE ACCESS PROTECTION (HT PASSWORD REPLACEMENT)
    // ----------------------------------------------------------------
    const publicPaths = ['/access', '/_next', '/api', '/static', '/favicon.ico', '/manifest.json'];
    const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

    if (!isPublicPath) {
        const siteAccessToken = request.cookies.get('site_access_token');
        if (!siteAccessToken) {
            return NextResponse.redirect(new URL('/access', request.url));
        }
    }

    // ----------------------------------------------------------------
    // 2. ADMIN PANEL PROTECTION
    // ----------------------------------------------------------------
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
        const adminToken = request.cookies.get('admin_token');

        if (!adminToken) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
