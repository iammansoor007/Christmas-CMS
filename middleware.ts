import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'fallback-secret-change-this'
);

const ADMIN_PREFIX = '/hidden/user/hidden/secret/admin';

export async function middleware(request) {
    const { pathname } = request.nextUrl;

    // Block old /admin route — return 404
    if (pathname.startsWith('/admin')) {
        return new NextResponse(null, { status: 404 });
    }

    // Only protect the new admin routes
    if (pathname.startsWith(ADMIN_PREFIX)) {
        // Allow login page through without checking token
        if (pathname === `${ADMIN_PREFIX}/login`) {
            return NextResponse.next();
        }

        const token = request.cookies.get('cms_token')?.value;

        if (!token) {
            return NextResponse.redirect(new URL(`${ADMIN_PREFIX}/login`, request.url));
        }

        try {
            const { payload } = await jwtVerify(token, JWT_SECRET);
            if (!payload || payload.role !== 'admin') {
                return NextResponse.redirect(new URL(`${ADMIN_PREFIX}/login`, request.url));
            }
            return NextResponse.next();
        } catch {
            // Token invalid/expired — clear cookie and redirect
            const response = NextResponse.redirect(new URL(`${ADMIN_PREFIX}/login`, request.url));
            response.cookies.set({ name: 'cms_token', value: '', expires: new Date(0), path: '/' });
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/hidden/user/hidden/secret/admin/:path*', '/admin/:path*'],
};
