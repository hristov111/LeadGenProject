"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, PhoneIncoming } from "lucide-react";
import { useEffect } from "react";
import { Locale } from "@/i18n-config";

import { useSearchParams } from "next/navigation";

interface ThankYouProps {
    dict: any;
    lang: Locale;
}

export default function ThankYouClient({ dict, lang }: ThankYouProps) {
    const searchParams = useSearchParams();
    const isDuplicate = searchParams.get("isDuplicate") === "true";

    useEffect(() => {
        // Log conversion
        fetch('/api/events', {
            method: 'POST',
            body: JSON.stringify({ eventName: "conversion_success", isDuplicate })
        }).catch(console.error);
    }, [isDuplicate]);

    return (
        <div className="container mx-auto px-4 py-12 md:py-24 flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="bg-green-100 p-6 rounded-full mb-8 animate-fadeIn">
                <CheckCircle2 className="h-16 w-16 text-green-600" />
            </div>

            <h1 className="text-4xl font-bold text-slate-900 mb-4 animate-slideUp">{dict.title}</h1>
            <p className="text-xl text-slate-600 max-w-lg mb-8 animate-slideUp">
                {isDuplicate ? (dict.duplicateSubtitle || dict.subtitle) : dict.subtitle}
            </p>
            <p className="text-md text-slate-500 max-w-lg mb-8 animate-slideUp">
                {isDuplicate ? (dict.duplicateMessage || dict.message) : dict.message}
            </p>

            <Card className="max-w-md w-full mb-10 border-primary-200 bg-primary-50 animate-slideUp">
                <CardContent className="p-6 flex items-center gap-4">
                    <div className="bg-white p-3 rounded-full">
                        <PhoneIncoming className="h-6 w-6 text-primary-600 animate-pulse" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-bold text-slate-900">{dict.whatNext || "Какво следва?"}</h3>
                        <p className="text-sm text-slate-600 leading-tight">{dict.expectCall || "Очаквайте обаждане..."}</p>
                    </div>
                </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link href={`/${lang}`} className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full">{dict.back}</Button>
                </Link>
                <Link href={`/${lang}/quiz`} className="w-full sm:w-auto">
                    <Button className="w-full">{dict.startNew || "Започни ново търсене"}</Button>
                </Link>
            </div>
        </div>
    );
}
