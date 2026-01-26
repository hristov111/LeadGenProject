import { NextResponse } from "next/server";
import { getAdminSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { password } = body;

        const sessionToken = getAdminSessionCookie(password);

        if (!sessionToken) {
            return NextResponse.json({ error: "Invalid password" }, { status: 401 });
        }

        const response = NextResponse.json({ success: true });

        // Set the secure httpOnly cookie
        response.cookies.set("admin_session", sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 1 week
        });

        return response;
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
