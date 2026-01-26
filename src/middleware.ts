import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from './i18n-config';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

function getLocale(request: NextRequest): string {
    // 1. Check cookie first for manual override
    const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
    if (cookieLocale && i18n.locales.includes(cookieLocale as any)) {
        return cookieLocale;
    }

    // 2. Check Accept-Language header
    const negotiatorHeaders: Record<string, string> = {};
    request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

    // @ts-ignore locales are readonly
    const locales: string[] = i18n.locales;

    // Use negotiator and intl-localematcher to get best locale
    let languages = new Negotiator({ headers: negotiatorHeaders }).languages(locales);

    try {
        return matchLocale(languages, locales, i18n.defaultLocale);
    } catch (e) {
        return i18n.defaultLocale;
    }
}

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Check if there is any supported locale in the pathname
    const pathnameIsMissingLocale = i18n.locales.every(
        (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );

    // Filter out internal Next.js paths, API routes, and static assets
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/static') ||
        pathname.includes('.') // images, etc.
    ) {
        return NextResponse.next();
    }

    // Redirect if there is no locale
    if (pathnameIsMissingLocale) {
        const locale = getLocale(request);

        return NextResponse.redirect(
            new URL(
                `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
                request.url
            )
        );
    }

    // Admin Route Protection (Hidden Mode)
    if (pathname.includes('/admin')) {
        const session = request.cookies.get('admin_session')?.value;
        const secretKey = request.nextUrl.searchParams.get('key');
        // Fallback for easier setup if env var is missing
        const expectedSecret = process.env.ADMIN_SECRET_KEY || 'telecom_master_access';

        console.log(`[Middleware] Checking admin access for: ${pathname}`);
        console.log(`[Middleware] Has session: ${!!session}, Has key: ${!!secretKey}`);

        // 1. If user is authenticated, they can see everything in /admin
        if (session) {
            return NextResponse.next();
        }

        // 2. If user is NOT authenticated, but is trying to reach the login page WITH the SECRET KEY
        if (pathname.includes('/admin/login') && secretKey) {
            if (secretKey === expectedSecret) {
                console.log('[Middleware] Secret key matched, allowing access to login');
                return NextResponse.next();
            } else {
                console.log(`[Middleware] Secret key mismatch. Expected: ${expectedSecret?.slice(0, 3)}... provided: ${secretKey}`);
            }
        }

        console.log('[Middleware] Access denied, rewriting to 404');
        // 3. In all other cases (unauthenticated + no secret key), 
        // we REWRITE to /not-found to make the admin area look non-existent (404).
        const segments = pathname.split('/');
        const locale = segments[1] || 'bg';

        // Rewrite to the locale-specific 404 page
        return NextResponse.rewrite(new URL(`/${locale}/404`, request.url));
    }
}

export const config = {
    // Matcher ignoring `/_next/`, `/api/`, ..
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
