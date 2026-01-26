import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = await request.json();
    // In a real app, send to analytics service (GA, Segment, etc.)
    console.log("[ANALYTICS EVENT]:", body);
    return NextResponse.json({ success: true });
}
