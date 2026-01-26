import { PageContainer } from "@/components/ui/page-container";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Target, UserCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AboutPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const dict = (await getDictionary(lang as Locale)) as any;

    const icons = [<Shield className="h-8 w-8 text-primary-600" />, <Target className="h-8 w-8 text-primary-600" />];

    return (
        <PageContainer className="py-24">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">{dict.about.title}</h1>
                    <p className="text-xl text-primary-600 font-medium">{dict.about.mission}</p>
                </div>

                {/* Who we are Paragraphs */}
                <div className="prose prose-slate max-w-none text-center mb-20">
                    {dict.about.content.split('\n\n').map((para: string, i: number) => (
                        <p key={i} className="text-lg text-slate-600 leading-relaxed mb-6 last:mb-0">
                            {para}
                        </p>
                    ))}
                </div>

                {/* Values Cards */}
                <div className="grid md:grid-cols-2 gap-8 mb-24">
                    {dict.about.values.map((value: any, idx: number) => (
                        <Card key={idx} className="border-none shadow-md bg-white">
                            <CardContent className="pt-8 text-center">
                                <div className="mb-4 flex justify-center">{icons[idx] || <UserCheck className="h-8 w-8 text-primary-600" />}</div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{value.title}</h3>
                                <p className="text-slate-500">{value.desc}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* How we work Section */}
                <div className="bg-slate-50 rounded-3xl p-10 md:p-16 mb-24 border border-slate-100">
                    <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">{dict.about.howItWorks.title}</h2>
                    <div className="grid gap-6">
                        {dict.about.howItWorks.steps.map((step: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-6 p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-600 text-white font-bold text-lg">
                                    {idx + 1}
                                </div>
                                <p className="text-lg text-slate-700 font-medium">{step}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* GDPR Footer */}
                <div className="pt-8 border-t border-slate-200 text-center mb-12">
                    <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        {dict.about.gdpr}
                    </p>
                </div>

                <div className="text-center bg-primary-50 rounded-2xl p-8 border border-primary-100">
                    <h3 className="text-xl font-bold text-slate-900 mb-4">{dict.ctas?.aboutReady || "Готови ли сте да започнете?"}</h3>
                    <Link href={`/${lang}/quiz`}>
                        <Button size="lg" className="cta-attention">
                            {dict.hero.ctaPrimary}
                        </Button>
                    </Link>
                </div>
            </div>
        </PageContainer>
    );
}
