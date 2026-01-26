import { NextResponse } from "next/server";
import crypto from "crypto";
import { cookies } from "next/headers";

export async function checkAdminAuth(request: Request) {
    const expected = process.env.ADMIN_PASSWORD?.trim();
    if (!expected) {
        console.error("ADMIN_PASSWORD is not set");
        return {
            isAuthenticated: false,
            errorResponse: NextResponse.json({ error: "Server misconfigured" }, { status: 500 })
        };
    }

    // 1. Check Authorization Header
    const authHeader = request.headers.get("authorization") ?? "";
    const token = authHeader.replace(/^Bearer\s+/i, "").trim();

    if (token) {
        const ok =
            token.length === expected.length &&
            crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));

        if (ok) return { isAuthenticated: true };
    }

    // 2. Check Cookie (for browser requests)
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session")?.value;

    if (session) {
        // We store the hashed password in the cookie for extra security
        const hashedExpected = crypto.createHash('sha256').update(expected).digest('hex');
        const ok = session === hashedExpected;

        if (ok) return { isAuthenticated: true };
    }

    return {
        isAuthenticated: false,
        errorResponse: NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    };
}

export function getAdminSessionCookie(password: string) {
    const expected = process.env.ADMIN_PASSWORD?.trim();
    if (password !== expected) return null;

    // Return the hashed password as the session token
    return crypto.createHash('sha256').update(expected).digest('hex');
}
