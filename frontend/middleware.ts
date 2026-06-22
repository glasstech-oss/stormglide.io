import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // ----------------------------------------------------------------
    // 1. SITE-WIDE ACCESS PROTECTION
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

    // ----------------------------------------------------------------
    // 3. CLIENT PORTAL PROTECTION
    //    /portal/login and /auth/verify are public (magic link flows)
    //    /portal itself checks for client_token in localStorage — done
    //    client-side because cookies.get() here checks httpOnly cookies,
    //    but client_token is in localStorage. The portal page handles
    //    the redirect to /portal/login itself.
    // ----------------------------------------------------------------

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
