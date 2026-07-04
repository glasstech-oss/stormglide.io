import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAdminSession } from '@/lib/adminSession';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isAdminRoute = pathname.startsWith('/admin');

    if (isAdminRoute) {
        const token = request.cookies.get('admin_token')?.value;
        const secret = process.env.ADMIN_SESSION_SECRET;
        const session = token && secret ? await verifyAdminSession(token, secret) : null;

        if (pathname === '/admin/login') {
            return NextResponse.next();
        }

        if (!session) {
            const response = NextResponse.redirect(new URL('/admin/login', request.url));
            response.cookies.delete('admin_token');
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
