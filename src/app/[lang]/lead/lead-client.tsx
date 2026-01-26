"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Lock } from "lucide-react";
import { Locale } from "@/i18n-config";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { trackEvent } from "@/lib/analytics";

// Simple Checkbox component inline for speed since we missed it in core
function SimpleCheckbox({ id, checked, onCheckedChange }: { id: string, checked: boolean, onCheckedChange: (c: boolean) => void }) {
    return (
        <div className="flex h-6 items-center">
            <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={(e) => onCheckedChange(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-600"
            />
        </div>
    )
}

interface LeadProps {
    dict: any;
    lang: Locale;
}

export default function LeadClient({ dict, lang }: LeadProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        consent: false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);

    const summary = {
        city: searchParams.get("city") || "Sofia",
        service: searchParams.get("serviceType") || "internet",
        usage: searchParams.get("usageIntent") || "streaming",
        timeline: searchParams.get("timeline") || "now",
        budget: searchParams.get("budget") || "no_preference",
    };

    // Masking logic: 08xx xxx xxx or +359 8xx xxx xxx
    const handlePhoneChange = (val: string) => {
        // Remove non-digits (and keep + if leading)
        let cleaned = val.replace(/[^\d+]/g, "");
        // If starts with 0 (standard BG), format 0888 123 456
        if (cleaned.startsWith("0")) {
            // 0888123456 -> 0888 123 456
            // Simple regex to insert spaces
            cleaned = cleaned.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3").trim();
            // Limit length? Standard mobile is 10 digits
            if (cleaned.length > 13) cleaned = cleaned.substring(0, 13);
        }
        setFormData(prev => ({ ...prev, phone: cleaned }));
    };

    const isValidPhone = (p: string) => {
        const raw = p.replace(/\s+/g, "");
        // 1. Basic Regex (08xxxxxxxx or +3598xxxxxxxx)
        const bgRegex = /^08\d{8}$/;
        const intlRegex = /^\+359\d{8,9}$/;

        if (!bgRegex.test(raw) && !intlRegex.test(raw)) return false;

        // 2. Anti-Junk: Reject all same digits (e.g. 0888888888)
        // Extract just the body (remove prefix)
        const body = raw.startsWith("+359") ? raw.slice(4) : raw;
        if (/^(\d)\1+$/.test(body)) return false;

        return true;
    };

    const isValidEmail = (email: string) => {
        if (!email) return true; // Optional
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handlePreSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!formData.name || !formData.phone || !formData.consent) {
            setError("Please fill in all required fields and accept the terms.");
            return;
        }

        if (!isValidPhone(formData.phone)) {
            setError("Please enter a valid Bulgarian phone number (08xx xxx xxx)");
            return;
        }

        if (formData.email && !isValidEmail(formData.email)) {
            setError("Please enter a valid email address.");
            return;
        }

        setShowConfirm(true);
    };

    const submitForm = async () => {
        setIsSubmitting(true);
        setShowConfirm(false);

        try {
            const payload = {
                ...formData,
                city: summary.city,
                serviceType: summary.service,
                usageIntent: summary.usage,
                timeline: summary.timeline,
                budget: summary.budget,

                // Track source data - ensure no nulls reach Zod schema
                source: searchParams.get("utm_source") || "direct",
                campaign: searchParams.get("utm_campaign") || undefined,
                medium: searchParams.get("utm_medium") || undefined,
                content: searchParams.get("utm_content") || undefined,
                term: searchParams.get("utm_term") || undefined,
                referrer: typeof document !== "undefined" ? (document.referrer || undefined) : undefined,
                formName: "step_by_step_conversion",
            };

            trackEvent("lead_submit", payload);

            const res = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.details?.[0]?.message || data.error || "Something went wrong");
            }

            router.push(`/${lang}/thank-you?leadId=${data.leadId}${data.isDuplicate ? "&isDuplicate=true" : ""}`);
        } catch (err: any) {
            setError(err.message);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-lg">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">{dict.title}</h1>
                <p className="text-slate-600">{dict.subtitle}</p>
            </div>

            <Card className="shadow-xl border-primary-100 overflow-hidden">
                <div className="bg-primary-50 p-4 border-b border-primary-100">
                    <h3 className="font-semibold text-primary-900 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary-600" /> {dict.summary.title}
                    </h3>
                    <div className="mt-2 text-sm text-slate-600 grid grid-cols-2 gap-2">
                        <div><span className="text-slate-400">{dict.summary.service}:</span> {summary.service}</div>
                        <div><span className="text-slate-400">{dict.summary.city}:</span> {summary.city}</div>
                        <div><span className="text-slate-400">{dict.summary.usage}:</span> {summary.usage}</div>
                        <div><span className="text-slate-400">{dict.summary.budget}:</span> {summary.budget}</div>
                        <div className="col-span-2"><span className="text-slate-400">{dict.summary.timeline}:</span> {summary.timeline}</div>
                    </div>
                </div>
                <CardContent className="p-6 md:p-8 space-y-4">
                    <form onSubmit={handlePreSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium">{dict.name} <span className="text-red-500">*</span></label>
                            <Input
                                id="name"
                                placeholder="Ivan Ivanov"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                autoComplete="name"
                                className="h-12"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="phone" className="text-sm font-medium">{dict.phone} <span className="text-red-500">*</span></label>
                            <Input
                                id="phone"
                                placeholder="0888 123 456"
                                value={formData.phone}
                                onChange={(e) => handlePhoneChange(e.target.value)}
                                type="tel"
                                required
                                autoComplete="tel"
                                inputMode="tel"
                                className="h-12 text-lg"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">{dict.email}</label>
                            <Input
                                id="email"
                                placeholder="ivan@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                type="email"
                                autoComplete="email"
                                inputMode="email"
                                className="h-12"
                            />
                        </div>

                        <div className="flex items-start gap-3 pt-4">
                            <SimpleCheckbox
                                id="consent"
                                checked={formData.consent}
                                onCheckedChange={(c) => setFormData({ ...formData, consent: c })}
                            />
                            <label htmlFor="consent" className="text-sm text-slate-600 leading-snug cursor-pointer select-none">
                                {dict.consent} <a href="/privacy" className="underline text-primary-600 hover:text-primary-700 font-medium">Privacy Policy</a>.
                            </label>
                        </div>

                        {error && (
                            <div className="p-3 rounded bg-red-50 text-red-600 text-sm">{error}</div>
                        )}

                        <Button type="submit" className="w-full h-12 text-lg font-bold shadow-lg" disabled={isSubmitting}>
                            {isSubmitting ? dict.submitting : dict.submit}
                        </Button>

                        <div className="flex items-center justify-center gap-1 text-xs text-slate-400">
                            <Lock className="h-3 w-3" /> {dict.secure}
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{dict.confirmPhone}</DialogTitle>
                        <DialogDescription className="text-xl font-bold text-center py-4 text-slate-900">
                            {formData.phone}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setShowConfirm(false)}>{dict.edit}</Button>
                        <Button onClick={submitForm}>{dict.confirm}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>


            <div className="mt-8 grid grid-cols-2 gap-4 text-center">
                <div className="bg-white p-4 rounded-lg border border-slate-100">
                    <div className="text-2xl font-bold text-slate-900">100%</div>
                    <div className="text-xs text-slate-500">Free Service</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-100">
                    <div className="text-2xl font-bold text-slate-900">Top</div>
                    <div className="text-xs text-slate-500">Providers Only</div>
                </div>
            </div>
        </div>
    );
}
