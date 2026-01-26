"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Steps } from "@/components/ui/steps";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Locale } from "@/i18n-config";
import { trackEvent } from "@/lib/analytics";

interface QuizProps {
    dict: any;
    lang: Locale;
}

export default function QuizClient({ dict, lang }: QuizProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const STEPS = [
        { id: 1, label: dict.steps.city },
        { id: 2, label: dict.steps.service },
        { id: 3, label: dict.steps.usage },
        { id: 4, label: dict.steps.budget },
        { id: 5, label: dict.steps.timeline },
    ];

    // Localized cities for BG (as per request "Quick chips Bulgarian")
    // Ideally this comes from dict or logic, but for now hardcoded BG as requested
    const BG_CITIES = ["София", "Пловдив", "Варна", "Бургас", "Русе", "Стара Загора", "Плевен"];
    const SUGGESTED_CITIES = BG_CITIES;

    const [currentStep, setCurrentStep] = useState(1);
    const [answers, setAnswers] = useState({
        city: "",
        serviceType: "internet",
        usageIntent: "streaming",
        budget: "", // New field
        timeline: "now",
    });

    // Load state from URL on mount
    useEffect(() => {
        const step = Number(searchParams.get("step")) || 1;
        setCurrentStep(step);
        trackEvent("quiz_step_view", { step });

        setAnswers((prev) => ({
            ...prev,
            city: searchParams.get("city") || prev.city,
            serviceType: searchParams.get("serviceType") || prev.serviceType,
            usageIntent: searchParams.get("usageIntent") || prev.usageIntent,
            budget: searchParams.get("budget") || prev.budget,
            timeline: searchParams.get("timeline") || prev.timeline,
        }));
    }, [searchParams]);

    const updateState = (key: string, value: string) => {
        setAnswers((prev) => ({ ...prev, [key]: value }));
    };

    const nextStep = () => {
        if (currentStep < 5) {
            const params = new URLSearchParams(searchParams.toString());
            params.set("step", String(currentStep + 1));
            Object.entries(answers).forEach(([key, val]) => {
                if (val) params.set(key, val);
            });
            router.push(`/${lang}/quiz?${params.toString()}`);
        } else {
            // Go to lead capture (or results page if implemented check later)
            // Implementation plan said "New Results Page" in Phase 5, currently "Phase 3"
            // For now stick to strict flow or redirect to lead if no results page yet.
            // But User requested Results page in Step 7 and approved plan.
            // I should implement Results page connection if I'm doing Phase 3 fully?
            // "Proceed with Phase 3" -> "Quiz Flow Improvements". Results page is Phase 5.
            // So link to /lead for now until Phase 5.
            const params = new URLSearchParams();
            Object.entries(answers).forEach(([key, val]) => {
                if (val) params.set(key, val);
            });
            trackEvent("quiz_complete", { ...answers });
            router.push(`/${lang}/results?${params.toString()}`);
        }
    };

    const skipStep = () => {
        // Clear value for this step if desired or just move next
        if (currentStep === 4) updateState("budget", "no_preference");

        if (currentStep < 5) {
            const params = new URLSearchParams(searchParams.toString());
            params.set("step", String(currentStep + 1));
            // Don't necessarily save 'no_preference' to URL if we want it clean, but saving is fine
            params.set("budget", "no_preference");
            Object.entries(answers).forEach(([key, val]) => {
                if (key !== "budget" && val) params.set(key, val);
            });
            router.push(`/${lang}/quiz?${params.toString()}`);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            const params = new URLSearchParams(searchParams.toString());
            params.set("step", String(currentStep - 1));
            router.push(`/${lang}/quiz?${params.toString()}`);
        } else {
            router.push(`/${lang}`);
        }
    };

    const isStepValid = () => {
        if (currentStep === 1) return answers.city.length > 2;
        // Step 2, 3 have defaults (serviceType, usageIntent) so always valid unless cleared
        // Step 4 (Budget) is optional -> "Skip" handles it, but "Next" requires selection? 
        // User said: "Disable 'Next' until a selection is made". "Add 'Skip' only for optional steps".
        // So for Step 4: Next disabled unless selected, Skip enabled.
        if (currentStep === 4) return !!answers.budget;
        return true;
    };

    // Handle Enter key for Step 1
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && isStepValid()) {
            nextStep();
        }
    }

    return (
        <div className="container mx-auto px-0 sm:px-4 py-0 sm:py-12 max-w-2xl min-h-screen sm:min-h-0 bg-white sm:bg-transparent">
            {/* Desktop Stepper */}
            <div className="hidden sm:block mb-8">
                <Steps steps={STEPS} currentStep={currentStep} />
                <p className="text-center text-sm text-slate-500 mt-2">{dict.ctas?.quizTime || "Отнема около 1 минута"}</p>
            </div>

            {/* Mobile Progress Bar */}
            <div className="sm:hidden fixed top-16 left-0 right-0 h-1 bg-slate-100 z-40">
                <div
                    className="h-full bg-primary-600 transition-all duration-300"
                    style={{ width: `${(currentStep / 5) * 100}%` }}
                />
            </div>

            <Card className="border-0 shadow-none sm:border sm:shadow-lg sm:rounded-xl p-4 sm:p-8 min-h-[calc(100vh-8rem)] sm:min-h-[400px] flex flex-col justify-between pb-24 sm:pb-8">
                <div className="mt-6 sm:mt-0">
                    <p className="sm:hidden text-center text-xs text-slate-400 mb-4">{dict.ctas?.quizTime || "Отнема около 1 минута"}</p>
                    {currentStep === 1 && (
                        <div className="animate-fadeIn">
                            <h2 className="text-2xl font-bold mb-4">{dict.step1.title}</h2>
                            <p className="text-slate-500 mb-6">{dict.step1.subtitle}</p>
                            <Input
                                placeholder={dict.step1.placeholder}
                                value={answers.city}
                                onChange={(e) => updateState("city", e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="mb-4 text-lg p-6"
                                autoFocus
                            />
                            <div className="flex flex-wrap gap-2">
                                {SUGGESTED_CITIES.map((city) => (
                                    <button
                                        key={city}
                                        onClick={() => updateState("city", city)}
                                        className={cn(
                                            "px-4 py-2 text-sm rounded-full border transition-colors min-h-[44px]",
                                            answers.city === city
                                                ? "bg-primary-100 border-primary-500 text-primary-700"
                                                : "bg-white border-slate-200 text-slate-600 hover:border-primary-300"
                                        )}
                                    >
                                        {city}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="animate-fadeIn">
                            <h2 className="text-2xl font-bold mb-4">{dict.step2.title}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {[
                                    { id: "internet", label: dict.step2.options.internet },
                                    { id: "mobile", label: dict.step2.options.mobile },
                                    { id: "bundle", label: dict.step2.options.bundle },
                                    { id: "business", label: dict.step2.options.business },
                                ].map((opt) => (
                                    <div
                                        key={opt.id}
                                        onClick={() => updateState("serviceType", opt.id)}
                                        className={cn(
                                            "p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md text-center font-medium min-h-[60px] flex items-center justify-center",
                                            answers.serviceType === opt.id
                                                ? "border-primary-500 bg-primary-50 text-primary-700"
                                                : "border-slate-100 bg-white text-slate-700 hover:border-primary-200"
                                        )}
                                    >
                                        {opt.label}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="animate-fadeIn">
                            <h2 className="text-2xl font-bold mb-4">{dict.step3.title}</h2>
                            <div className="grid grid-cols-1 gap-3">
                                {[
                                    { id: "streaming", ...dict.step3.options.streaming },
                                    { id: "work", ...dict.step3.options.work },
                                    { id: "gaming", ...dict.step3.options.gaming },
                                    { id: "light", ...dict.step3.options.light },
                                ].map((opt) => (
                                    <div
                                        key={opt.id}
                                        onClick={() => updateState("usageIntent", opt.id)}
                                        className={cn(
                                            "p-4 rounded-lg border-2 cursor-pointer transition-all flex justify-between items-center text-left min-h-[70px]",
                                            answers.usageIntent === opt.id
                                                ? "border-primary-500 bg-primary-50"
                                                : "border-slate-100 bg-white hover:border-primary-200"
                                        )}
                                    >
                                        <div>
                                            <div className={cn("font-bold", answers.usageIntent === opt.id ? "text-primary-800" : "text-slate-800")}>{opt.label}</div>
                                            <div className="text-xs text-slate-500">{opt.desc}</div>
                                        </div>
                                        <div className={cn("h-6 w-6 flex-none rounded-full border-2 flex items-center justify-center ml-2", answers.usageIntent === opt.id ? "border-primary-500" : "border-slate-300")}>
                                            {answers.usageIntent === opt.id && <div className="h-3 w-3 rounded-full bg-primary-500" />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div className="animate-fadeIn">
                            <h2 className="text-2xl font-bold mb-4">{dict.step4.title}</h2>
                            <div className="grid grid-cols-1 gap-3">
                                {[
                                    { id: "low", label: dict.step4.options.low },
                                    { id: "medium", label: dict.step4.options.medium },
                                    { id: "high", label: dict.step4.options.high },
                                    { id: "no_preference", label: dict.step4.options.no_preference },
                                ].map((opt) => (
                                    <div
                                        key={opt.id}
                                        onClick={() => updateState("budget", opt.id)}
                                        className={cn(
                                            "p-4 rounded-lg border-2 cursor-pointer transition-all text-center font-medium min-h-[56px] flex items-center justify-center",
                                            answers.budget === opt.id
                                                ? "border-primary-500 bg-primary-50 text-primary-700"
                                                : "border-slate-100 bg-white text-slate-700 hover:border-primary-200"
                                        )}
                                    >
                                        {opt.label}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {currentStep === 5 && (
                        <div className="animate-fadeIn">
                            <h2 className="text-2xl font-bold mb-4">{dict.step5.title}</h2>
                            <div className="space-y-3">
                                {[
                                    { id: "now", label: dict.step5.options.now },
                                    { id: "30_days", label: dict.step5.options["30_days"] },
                                    { id: "later", label: dict.step5.options.later },
                                ].map((opt) => (
                                    <button
                                        key={opt.id}
                                        onClick={() => updateState("timeline", opt.id)}
                                        className={cn(
                                            "w-full p-4 rounded-lg border-2 text-left font-medium transition-all min-h-[56px]",
                                            answers.timeline === opt.id
                                                ? "border-primary-500 bg-primary-50 text-primary-900"
                                                : "border-slate-100 bg-white text-slate-700 hover:border-primary-200"
                                        )}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                            <p className="text-center text-sm text-slate-500 mt-6 bg-slate-50 py-2 rounded-lg">
                                {dict.ctas?.quizFree || "Напълно безплатно и необвързващо"}
                            </p>
                        </div>
                    )}
                </div>

                <div className="hidden sm:flex justify-between mt-8 pt-6 border-t border-slate-100 items-center">
                    <Button variant="ghost" onClick={prevStep} className="gap-2">
                        <ArrowLeft className="h-4 w-4" /> {dict.navigation.back}
                    </Button>

                    <div className="flex gap-4">
                        {currentStep === 4 && (
                            <Button variant="ghost" onClick={skipStep} className="text-slate-500 hover:text-slate-700">
                                {dict.navigation.skip}
                            </Button>
                        )}
                        <Button onClick={nextStep} disabled={!isStepValid()} className="gap-2 px-8">
                            {currentStep === 5 ? dict.navigation.viewResults : dict.navigation.next} <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Mobile Sticky Navigation */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 sm:hidden z-50 flex gap-3 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <Button variant="outline" onClick={prevStep} className="flex-1" disabled={currentStep === 1}>
                    {dict.navigation.back}
                </Button>

                {currentStep === 4 && (
                    <Button variant="ghost" onClick={skipStep} className="px-2 text-slate-500">
                        {dict.navigation.skip}
                    </Button>
                )}

                <Button onClick={nextStep} disabled={!isStepValid()} className="flex-[2]">
                    {currentStep === 5 ? dict.navigation.viewResults : dict.navigation.next}
                </Button>
            </div>

            <p className="hidden sm:block text-center text-xs text-slate-400 mt-6">
                {dict.navigation.progress.replace("{step}", String(currentStep)).replace("{total}", "5")}
            </p>
        </div>
    );
}
