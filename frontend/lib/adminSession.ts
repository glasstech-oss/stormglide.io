export type AdminSession = {
    sub: string;
    email: string | null;
    role: 'OMEGA' | 'ADMIN';
    exp: number;
};

const encoder = new TextEncoder();

function bytesToBase64Url(bytes: Uint8Array): string {
    let binary = '';
    bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlToBytes(value: string): Uint8Array {
    const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    const binary = atob(padded);
    return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function createSignature(value: string, secret: string): Promise<Uint8Array> {
    const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign'],
    );
    return new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(value)));
}

export async function signAdminSession(payload: AdminSession, secret: string): Promise<string> {
    const encodedPayload = bytesToBase64Url(encoder.encode(JSON.stringify(payload)));
    const signature = bytesToBase64Url(await createSignature(encodedPayload, secret));
    return `${encodedPayload}.${signature}`;
}

export async function verifyAdminSession(token: string, secret: string): Promise<AdminSession | null> {
    try {
        const [encodedPayload, encodedSignature, extra] = token.split('.');
        if (!encodedPayload || !encodedSignature || extra) return null;

        const actualSignature = base64UrlToBytes(encodedSignature);
        const expectedSignature = await createSignature(encodedPayload, secret);
        if (actualSignature.length !== expectedSignature.length) return null;

        let mismatch = 0;
        for (let index = 0; index < actualSignature.length; index += 1) {
            mismatch |= actualSignature[index] ^ expectedSignature[index];
        }
        if (mismatch !== 0) return null;

        const payload = JSON.parse(new TextDecoder().decode(base64UrlToBytes(encodedPayload))) as AdminSession;
        if (!payload.sub || !['OMEGA', 'ADMIN'].includes(payload.role) || payload.exp <= Math.floor(Date.now() / 1000)) {
            return null;
        }
        return payload;
    } catch {
        return null;
    }
}
