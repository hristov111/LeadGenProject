import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, message } = body;

        // Validation
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Initialize Resend
        const resend = new Resend(process.env.RESEND_API_KEY);

        // Send email
        const data = await resend.emails.send({
            from: 'onboarding@resend.dev', // Must use verify domain or this default in sandbox
            to: 'hristovkaloyan11@gmail.com', // User explicitly provided this email
            subject: `New Contact Form: ${name}`,
            html: `
                <h2>New Contact Request</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
            `
        });

        console.log("Email sent:", data);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error processing contact form:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
