import { z } from "zod";

export const leadSchema = z.object({
    name: z.string().min(2, "Name is required"),
    phone: z.string().min(8, "Valid phone number is required"), // Basic validation for BG
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    city: z.string().min(2, "City is required"),
    serviceType: z.enum(["internet", "mobile", "bundle", "business"]),
    usageIntent: z.string(),
    budget: z.string().optional(),
    notes: z.string().optional(),
    timeline: z.string(),
    consent: z.boolean().refine((val) => val === true, {
        message: "Consent is required",
    }),

    // Optional Tracking & Workflow fields (passed from client or admin)
    source: z.string().optional(),
    campaign: z.string().optional(),
    medium: z.string().optional(),
    content: z.string().optional(),
    term: z.string().optional(),
    referrer: z.string().optional(),
    formName: z.string().optional(),

    assignedTo: z.string().optional(),
    followUpAt: z.string().datetime().optional().or(z.literal("")),
    nextAction: z.string().optional(),
    callOutcome: z.string().optional(),
    pipelineStatus: z.string().optional(),

    operatorAccepted: z.boolean().optional(),
    activationDate: z.string().datetime().optional().or(z.literal("")),
    operatorNotes: z.string().optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;

export const eventSchema = z.object({
    eventName: z.string(),
    payload: z.any().optional(),
});

export const contactSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
    message: z.string().min(10, "Message must be at least 10 characters long"),
});

export type ContactInput = z.infer<typeof contactSchema>;
