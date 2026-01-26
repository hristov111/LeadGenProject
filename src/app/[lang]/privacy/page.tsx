import { PageContainer } from "@/components/ui/page-container";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function PrivacyPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const dict = (await getDictionary(lang as Locale)) as any;

    return (
        <PageContainer className="py-24">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold mb-4">{dict.privacy.title}</h1>
                <p className="text-slate-500 mb-8">{dict.privacy.lastUpdated}</p>

                <div className="prose prose-slate max-w-none">
                    <p className="text-lg text-slate-700 mb-8">
                        {dict.privacy.intro}
                    </p>

                    <div className="space-y-8">
                        {dict.privacy.sections.map((section: any, idx: number) => (
                            <section key={idx}>
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">{section.title}</h2>
                                <p className="text-slate-600 leading-relaxed">{section.content}</p>
                            </section>
                        ))}
                    </div>

                    <div className="mt-16 pt-8 border-t border-slate-200 text-center">
                        <p className="text-slate-700 mb-4">
                            {dict.ctas?.policyReady || "Ако сте съгласни с условията, можете да продължите към търсенето."}
                        </p>
                        <Link href={`/${lang}/quiz`}>
                            <Button>
                                {dict.hero.ctaPrimary}
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}
