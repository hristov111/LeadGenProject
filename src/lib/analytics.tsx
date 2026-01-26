"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Simple event tracking - in a real app this would send to GA4/Mixpanel/PostHog
// For now, we'll just log to console in dev, or could be extended to hit our own API

type EventName =
    | "page_view"
    | "quiz_start"
    | "quiz_step_view"
    | "quiz_complete"
    | "lead_submit"
    | "lead_confirm_modal_view"
    | "lead_contact_click"
    | string;

export const trackEvent = (name: EventName, properties?: Record<string, any>) => {
    // 1. Log to console for DX
    if (process.env.NODE_ENV === "development") {
        console.log(`[Analytics] ${name}`, properties);
    }

    // 2. Send to API (optional for this MVP but good practice)
    /*
    try {
        fetch("/api/events", {
            method: "POST",
            body: JSON.stringify({ name, properties, url: window.location.href, timestamp: new Date() }),
            keepalive: true,
        });
    } catch (e) {
        // ignore analytics errors
    }
    */

    // 3. GTM / GA4 integration would go here
    // if (typeof window !== 'undefined' && window.gtag) { ... }
};

export function AnalyticsProvider() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const url = `${pathname}?${searchParams}`;
        trackEvent("page_view", { url });
    }, [pathname, searchParams]);

    return null;
}
