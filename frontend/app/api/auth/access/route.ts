import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { code } = body;

        // In a real app, this should be an env variable. 
        // Using 'stormglide-2026' as the default access code for now.
        const VALID_CODE = process.env.SITE_ACCESS_CODE || 'stormglide-2026';

        if (code === VALID_CODE) {
            // Set a cookie that middleware will check
            cookies().set('site_access_token', 'granted', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 7, // 1 week
                path: '/',
            });

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ success: false }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
