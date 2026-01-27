"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface PageCTAProps {
    title: string;
    subtitle?: string;
    primaryCtaText: string;
    primaryHref: string;
    secondaryText?: string;
    secondaryHref?: string;
    eventName?: string;
    className?: string;
}

export function PageCTA({
    title,
    subtitle,
    primaryCtaText,
    primaryHref,
    secondaryText,
    secondaryHref,
    eventName = "cta_click",
    className,
}: PageCTAProps) {
    return (
        <div className={cn("bg-primary-50 rounded-3xl p-8 md:p-12 text-center my-12", className)}>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                {title}
            </h2>
            {subtitle && (
                <p className="text-slate-600 mb-8 max-w-2xl mx-auto text-lg">
                    {subtitle}
                </p>
            )}

            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href={primaryHref} onClick={() => trackEvent(eventName, { type: "primary" })}>
                    <Button size="lg" className="w-full sm:w-auto text-lg px-6 py-4 min-h-14 h-auto shadow-lg shadow-primary-500/20 gap-2 whitespace-normal leading-tight">
                        {primaryCtaText} <ArrowRight className="h-5 w-5 shrink-0" />
                    </Button>
                </Link>

                {secondaryText && secondaryHref && (
                    <Link href={secondaryHref} onClick={() => trackEvent(eventName, { type: "secondary" })}>
                        <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 h-14 bg-white hover:bg-slate-50 border-primary-200 text-primary-700">
                            {secondaryText}
                        </Button>
                    </Link>
                )}
            </div>
        </div>
    );
}
