import { PageContainer } from "@/components/ui/page-container";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { ContactForm } from "./contact-form";

export default async function ContactPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const dict = (await getDictionary(lang as Locale)) as any;

    return (
        <PageContainer className="py-24">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">{dict.contact.title}</h1>
                    <p className="text-lg text-slate-600">{dict.contact.subtitle}</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-1 space-y-8">
                        {/* Email removed as per request */}

                        <div className="p-6 rounded-xl bg-slate-50 border border-slate-100 italic text-sm text-slate-500">
                            "{dict.contact.note}"
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <Card className="border-none shadow-xl bg-white overflow-hidden">
                            <CardHeader className="bg-primary-600 text-white p-8">
                                <CardTitle className="text-2xl flex items-center gap-3">
                                    <MessageSquare className="h-6 w-6" />
                                    Изпратете запитване
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8">
                                <ContactForm dict={dict} lang={lang} />
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="mt-16 text-center animate-fadeIn bg-slate-50 p-8 rounded-2xl border border-slate-100 max-w-2xl mx-auto">
                    <h3 className="text-xl font-bold text-slate-900 mb-4">{dict.ctas?.contactBackToQuiz || "Предпочитате да отговорите на няколко въпроса?"}</h3>
                    <Link href={`/${lang}/quiz`}>
                        <Button variant="outline" size="lg" className="border-primary-200 text-primary-700 hover:bg-white hover:text-primary-800 bg-white shadow-sm">
                            {dict.hero.ctaPrimary}
                        </Button>
                    </Link>
                </div>
            </div>
        </PageContainer>
    );
}
