
import { NextResponse } from "next/server";

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

        // Simulating email sending logic
        console.log("----------------------------------------------------------------");
        console.log(`[CONTACT FORM] New Submission`);
        console.log(`TO: support@telecombglabs.com`);
        console.log(`FROM: ${name} <${email}>`);
        console.log(`MESSAGE: ${message}`);
        console.log("----------------------------------------------------------------");

        // Here you would integrate with Resend, SendGrid, or Nodemailer
        // await sendEmail({ to: 'support@telecombglabs.com', subject: 'New Contact', text: message });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error processing contact form:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
