"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { Locale } from "@/i18n-config";

interface HeroButtonsProps {
    lang: Locale;
    dict: any;
}

export function HeroButtons({ lang, dict }: HeroButtonsProps) {
    return (
        <div className="flex flex-col items-center animate-slideUp" style={{ animationDelay: '0.2s' }}>
            <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-lg mx-auto w-full">
                <div className="flex flex-col w-full sm:w-auto gap-2">
                    <Link href={`/${lang}/quiz`} onClick={() => trackEvent("quiz_start", { source: "hero_primary" })}>
                        <Button size="lg" className="w-full h-14 px-8 text-lg gap-2 shadow-xl shadow-primary-500/20 cta-attention group">
                            {dict.hero.ctaPrimary} <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                        </Button>
                    </Link>
                    <span className="text-xs text-slate-500 font-medium text-center">{dict.hero.ctaPrimarySub}</span>
                </div>

                <div className="flex flex-col w-full sm:w-auto gap-2">
                    <Link href={`/${lang}/lead`} onClick={() => trackEvent("page_view", { source: "hero_direct" })}>
                        <Button variant="outline" size="lg" className="w-full h-14 px-8 text-lg border-2 hover:bg-slate-50">
                            {dict.hero.ctaDirect}
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="mt-4 w-full max-w-[280px] sm:max-w-xs mx-auto animate-slideUp" style={{ animationDelay: '0.3s' }}>
                <Link href={`/${lang}/internet`} onClick={() => trackEvent("page_view", { source: "hero_internet_check" })}>
                    <Button variant="outline" className="w-full text-slate-600 border-primary-200 hover:border-primary-400 hover:text-primary-700 bg-white/50 backdrop-blur-sm">
                        {dict.hero.ctaInternet}
                    </Button>
                </Link>
            </div>

            <div className="mt-4 text-center">
                <Link href={`/${lang}#how-it-works`} className="text-sm font-medium text-slate-500 hover:text-primary-600 underline-offset-4 hover:underline transition-colors">
                    {dict.hero.ctaSecondary}
                </Link>
            </div>
        </div>
    );
}
