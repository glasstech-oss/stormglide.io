import { NextResponse } from 'next/server';
import { signAdminSession } from '@/lib/adminSession';

const SESSION_MAX_AGE = 60 * 60 * 8;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
    || 'https://us-central1-stormglideio.cloudfunctions.net/api';

type VerifiedAdmin = {
    authorized: boolean;
    uid: string;
    email: string | null;
    role: 'OMEGA' | 'ADMIN';
    message?: string;
};

export async function POST(request: Request) {
    try {
        const { idToken } = await request.json() as { idToken?: string };
        const secret = process.env.ADMIN_SESSION_SECRET;

        if (!idToken || idToken.length > 10000) {
            return NextResponse.json({ message: 'A valid identity token is required.' }, { status: 400 });
        }
        if (!secret) {
            console.error('ADMIN_SESSION_SECRET is not configured.');
            return NextResponse.json({ message: 'Admin sessions are not configured.' }, { status: 500 });
        }

        const verificationResponse = await fetch(`${API_BASE_URL}/v1/auth/admin/session`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${idToken}`,
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });
        const verified = await verificationResponse.json() as VerifiedAdmin;

        if (!verificationResponse.ok || !verified.authorized || !['OMEGA', 'ADMIN'].includes(verified.role)) {
            return NextResponse.json(
                { message: verified.message || 'This account is not authorized.' },
                { status: verificationResponse.status === 401 ? 401 : 403 },
            );
        }

        const expiresAt = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
        const sessionToken = await signAdminSession({
            sub: verified.uid,
            email: verified.email,
            role: verified.role,
            exp: expiresAt,
        }, secret);

        const response = NextResponse.json({ success: true, email: verified.email });
        response.cookies.set('admin_token', sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: SESSION_MAX_AGE,
            path: '/',
        });
        return response;
    } catch (error) {
        console.error('Admin session creation failed:', error);
        return NextResponse.json({ message: 'Unable to create the admin session.' }, { status: 500 });
    }
}
