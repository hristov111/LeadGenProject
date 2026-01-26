"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, CheckCircle2, Loader2, Sparkles, Building2 } from "lucide-react";
import { Locale } from "@/i18n-config";

interface ResultsProps {
    dict: any;
    lang: Locale;
}

export default function ResultsClient({ dict, lang }: ResultsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isAnalyzing, setIsAnalyzing] = useState(true);

    const city = searchParams.get("city") || "";
    const service = searchParams.get("serviceType") || "";
    const usage = searchParams.get("usageIntent") || "";
    const budget = searchParams.get("budget") || "";

    // MVP Match Logic: Determine category based on inputs
    // This avoids claiming specific availability unless we have data
    let matchKey = "generic";
    if (service === "internet") {
        if (budget === "low" || usage === "light") matchKey = "internet_budget";
        else matchKey = "internet_speed";
    } else if (service === "mobile") {
        if (budget === "low") matchKey = "mobile_budget";
        else matchKey = "mobile_unlimited";
    } else if (service === "bundle") {
        matchKey = "tv_package";
    } else if (service === "business") {
        matchKey = "business_pro";
    }

    const planTitle = dict.results?.planTypes?.[matchKey] || dict.results?.planTypes?.["generic"] || "Premium Plans";

    // Simulate analysis delay
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsAnalyzing(false);
        }, 2000); // 2 seconds "analyzing"
        return () => clearTimeout(timer);
    }, []);

    const handleContinue = () => {
        const params = new URLSearchParams(searchParams.toString());
        router.push(`/${lang}/lead?${params.toString()}`);
    };

    return (
        <div className="container mx-auto px-4 py-8 md:py-16 max-w-2xl text-center min-h-[50vh] flex flex-col justify-center">
            {isAnalyzing ? (
                <div className="animate-fadeIn space-y-6">
                    <div className="relative mx-auto w-16 h-16 md:w-24 md:h-24">
                        <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-primary-500 border-t-transparent animate-spin"></div>
                        <Sparkles className="absolute inset-0 m-auto h-6 w-6 md:h-8 md:w-8 text-primary-500 animate-pulse" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">{dict.results.title}</h2>
                    <p className="text-slate-500">{dict.loading}</p>
                </div>
            ) : (
                <div className="animate-slideUp space-y-8">
                    <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-bounce-short">
                        <CheckCircle2 className="h-10 w-10 text-green-600" />
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
                            {dict.results.foundTitle}
                        </h1>

                        {/* AI Insight Block */}
                        <div className="bg-white p-5 rounded-xl border border-primary-100 text-left max-w-lg mx-auto shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary-400 to-primary-600"></div>
                            <div className="flex gap-4">
                                <div className="bg-primary-50 p-2 rounded-lg h-fit">
                                    <Sparkles className="h-5 w-5 text-primary-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-primary-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                                        AI Analysis <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></span>
                                    </p>
                                    <p className="text-sm text-slate-700 leading-relaxed">
                                        На база начина ви на ползване (<span className="font-semibold text-slate-900">{dict.quiz?.step3?.options?.[usage]?.label || usage}</span>)
                                        и локацията (<span className="font-semibold text-slate-900">{city || "вашия район"}</span>),
                                        най-подходящото решение е <span className="font-semibold text-primary-700">{planTitle}</span>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Card className="p-6 border-2 border-primary-100 bg-white shadow-xl mx-auto max-w-md">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-slate-100 p-3 rounded-full">
                                <Building2 className="h-6 w-6 text-slate-600" />
                            </div>
                            <div className="text-left">
                                <div className="font-bold text-slate-900 text-lg">{planTitle}</div>
                                <div className="text-xs text-slate-500">{dict.results.matchStatus}</div>
                            </div>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                            <div className="h-full bg-green-500 w-full animate-pulse"></div>
                        </div>
                        <p className="text-sm font-medium text-green-600 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> {dict.results.providerCount}
                        </p>
                    </Card>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 max-w-md mx-auto mt-6 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
                        <h3 className="text-lg font-bold text-slate-900 mb-3">{dict.ctas?.resultsNextStep || "Следваща стъпка: Получете конкретни предложения"}</h3>
                        <Button
                            size="lg"
                            className="w-full h-14 text-lg font-bold shadow-lg shadow-primary-500/20 animate-pulse-subtle mb-4"
                            onClick={handleContinue}
                        >
                            {dict.ctas?.resultsContinue || "Продължи"} <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Link href={`/${lang}/contact`} className="text-sm font-medium text-slate-500 hover:text-primary-700 hover:underline underline-offset-4 transition-colors">
                            {dict.ctas?.resultsContact || "Или се свържете с нас директно"}
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
