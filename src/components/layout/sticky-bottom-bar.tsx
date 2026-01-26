"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { Locale } from "@/i18n-config";

interface StickyBottomBarProps {
    lang: Locale;
    dict: any;
}

export function StickyBottomBar({ lang, dict }: StickyBottomBarProps) {
    return (
        <div className="fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t border-slate-200 md:hidden z-50 flex gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-[env(safe-area-inset-bottom)]">
            <Link href={`/${lang}/quiz`} className="flex-1" onClick={() => trackEvent("quiz_start", { source: "sticky_bottom" })}>
                <Button size="lg" className="w-full h-12 text-base shadow-md gap-2" variant="default">
                    {dict.hero.ctaPrimary} <ArrowRight className="h-4 w-4" />
                </Button>
            </Link>


        </div>
    );
}
