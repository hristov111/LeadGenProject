"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Smartphone, Home } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { Locale } from "@/i18n-config";

interface HeroButtonsProps {
    lang: Locale;
    dict: any;
}

export function HeroButtons({ lang, dict }: HeroButtonsProps) {
    return (
        <div className="flex flex-col items-center animate-slideUp" style={{ animationDelay: '0.2s' }}>
            <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-2xl mx-auto w-full">
                <div className="flex flex-col w-full sm:w-auto gap-2">
                    <Link href={`/${lang}/quiz`} onClick={() => trackEvent("quiz_start", { source: "hero_primary" })}>
                        <Button size="lg" className="w-full min-h-14 h-auto py-4 px-6 text-base sm:text-lg gap-2 shadow-xl shadow-primary-500/20 cta-attention group whitespace-normal">
                            {dict.hero.ctaPrimary} <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 shrink-0" />
                        </Button>
                    </Link>
                    <span className="text-xs text-slate-500 font-medium text-center">{dict.hero.ctaPrimarySub}</span>
                </div>

                <div className="flex flex-col w-full sm:w-auto gap-2">
                    <Link href={`/${lang}/lead`} onClick={() => trackEvent("page_view", { source: "hero_direct" })}>
                        <Button variant="outline" size="lg" className="w-full min-h-14 h-auto py-4 px-6 text-base sm:text-lg border-2 hover:bg-slate-50 whitespace-normal">
                            {dict.hero.ctaDirect}
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="mt-8 w-full max-w-lg mx-auto animate-slideUp" style={{ animationDelay: '0.3s' }}>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 text-center">
                    {dict.hero.intentLabel}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href={`/${lang}/internet`}
                        className="group flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-primary-300 hover:bg-primary-50/50 hover:text-primary-700 transition-all duration-200 shadow-sm hover:shadow-md"
                        onClick={() => trackEvent("intent_select", { type: "internet", source: "hero_pills" })}
                    >
                        <Home className="h-4 w-4 text-slate-400 group-hover:text-primary-500 transition-colors" />
                        <span className="font-medium">{dict.navigation.internet}</span>
                    </Link>

                    <Link
                        href={`/${lang}/mobile-plans`}
                        className="group flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-primary-300 hover:bg-primary-50/50 hover:text-primary-700 transition-all duration-200 shadow-sm hover:shadow-md"
                        onClick={() => trackEvent("intent_select", { type: "mobile", source: "hero_pills" })}
                    >
                        <Smartphone className="h-4 w-4 text-slate-400 group-hover:text-primary-500 transition-colors" />
                        <span className="font-medium">{dict.navigation.mobile}</span>
                    </Link>
                </div>
            </div>

            <div className="mt-4 text-center">
                <Link href={`/${lang}#how-it-works`} className="text-sm font-medium text-slate-500 hover:text-primary-600 underline-offset-4 hover:underline transition-colors">
                    {dict.hero.ctaSecondary}
                </Link>
            </div>
        </div>
    );
}
