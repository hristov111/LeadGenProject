import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { leadSchema } from "@/lib/schemas";
import { checkAdminAuth } from "@/lib/auth";
import { Lead } from "@prisma/client";

const rateLimitMap = new Map<string, { count: number; firstSubmission: number }>();

function normalizePhone(phone: string): string {
    const digits = phone.replace(/\D/g, "");
    if (digits.startsWith("0") && digits.length === 10) {
        return "359" + digits.substring(1);
    }
    if (digits.startsWith("00359")) {
        return digits.substring(2);
    }
    return digits;
}

export async function POST(request: Request) {
    try {
        const ip = request.headers.get("x-forwarded-for") || "unknown";
        const nowMs = Date.now();
        const windowMs = 10 * 60 * 1000;
        const rateLimit = 5;

        const record = rateLimitMap.get(ip);
        if (record && nowMs - record.firstSubmission < windowMs && record.count >= rateLimit) {
            return NextResponse.json(
                { error: "Моля, опитайте отново след няколко минути." },
                { status: 429 }
            );
        }

        const body = await request.json();

        const result = leadSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: "Validation failed", details: result.error.flatten() },
                { status: 400 }
            );
        }

        // Update rate limit
        if (!record || nowMs - record.firstSubmission > windowMs) {
            rateLimitMap.set(ip, { count: 1, firstSubmission: nowMs });
        } else {
            record.count++;
        }

        const data = result.data;
        const normalizedPhone = normalizePhone(data.phone);

        // Check for existing lead with same normalized phone
        const existingLeads = await prisma.lead.findMany({
            where: { phone: { contains: normalizedPhone.slice(-9) } }, // Simple fuzzy match for BG numbers
            orderBy: { createdAt: "asc" }
        });

        // More precise normalization check
        const originalLead = existingLeads.find((l: Lead) => normalizePhone(l.phone) === normalizedPhone);

        let qualityScore = 0;
        if (data.timeline === "now") qualityScore += 2;
        if (originalLead) qualityScore += 1;

        // Fast completion check (<10s since last submission from same IP)
        const lastFromIp = await prisma.lead.findFirst({
            where: { ipAddress: ip },
            orderBy: { createdAt: "desc" }
        });
        if (lastFromIp && nowMs - lastFromIp.createdAt.getTime() < 10000) {
            qualityScore -= 2;
        }

        const isDuplicate = !!originalLead;

        const lead = await prisma.lead.create({
            data: {
                name: data.name,
                phone: data.phone,
                email: data.email || null,
                city: data.city,
                serviceType: data.serviceType,
                usageIntent: data.usageIntent,
                budget: data.budget || null,
                timeline: data.timeline,
                consent: data.consent,
                notes: data.notes,
                isDuplicate,
                originalLeadId: originalLead?.id || null,
                qualityScore,
                lastSubmittedAt: new Date(),

                // Tracking
                source: data.source || null,
                campaign: data.campaign || null,
                medium: data.medium || null,
                content: data.content || null,
                term: data.term || null,
                referrer: data.referrer || request.headers.get("referer") || null,
                formName: data.formName || "main_contact",

                // Advanced Metadata
                ipAddress: ip,
                consentTimestamp: new Date(),
                policyVersion: "1.0",
                pipelineStatus: "new",
            },
        });

        if (originalLead) {
            await prisma.lead.update({
                where: { id: originalLead.id },
                data: {
                    duplicateCount: { increment: 1 },
                    lastSubmittedAt: new Date(),
                }
            });
        }

        return NextResponse.json({
            success: true,
            leadId: lead.id,
            isDuplicate
        }, { status: 201 });
    } catch (error: any) {
        console.error("Error creating lead:", error);
        return NextResponse.json(
            { error: "Internal Server Error", message: error.message, stack: error.stack },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    const { isAuthenticated, errorResponse } = await checkAdminAuth(request);
    if (!isAuthenticated) return errorResponse;

    try {
        const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });
        return NextResponse.json(leads);
    } catch (error) {
        console.error("Error fetching leads:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    const { isAuthenticated, errorResponse } = await checkAdminAuth(request);
    if (!isAuthenticated) return errorResponse;

    try {
        const body = await request.json();
        const { id, ...updates } = body;

        if (!id) {
            return NextResponse.json({ error: "Missing id" }, { status: 400 });
        }

        // Basic validation for updates if they exist in schema
        // We allow partial updates for flexibility in admin dashboard

        const updateData: any = {};

        // Define allowed fields for update
        const allowedFields = [
            'status', 'notes', 'assignedTo', 'followUpAt',
            'nextAction', 'callOutcome', 'pipelineStatus',
            'operatorAccepted', 'activationDate', 'operatorNotes',
            'qualityScore'
        ];

        for (const field of allowedFields) {
            if (updates[field] !== undefined) {
                // Handle date conversion
                if (['assignedAt', 'followUpAt', 'activationDate'].includes(field) && updates[field]) {
                    updateData[field] = new Date(updates[field]);
                } else {
                    updateData[field] = updates[field];
                }
            }
        }

        // Special logic for assignment
        if (updates.assignedTo && !updates.assignedAt) {
            updateData.assignedAt = new Date();
        }

        const updatedLead = await prisma.lead.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json(updatedLead);
    } catch (error) {
        console.error("Error updating lead:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}