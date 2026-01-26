import { PageContainer } from "@/components/ui/page-container";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import React from "react";

export default async function CookiesPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const dict = (await getDictionary(lang as Locale)) as any;

    return (
        <PageContainer className="py-24">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">{dict.cookies.title}</h1>

                <div className="prose prose-slate max-w-none">
                    <p className="text-lg text-slate-700 mb-8">
                        {dict.cookies.intro}
                    </p>

                    <div className="grid gap-6">
                        {dict.cookies.types.map((type: any, idx: number) => (
                            <div key={idx} className="p-6 rounded-xl border border-slate-200 bg-white">
                                <h2 className="text-xl font-bold text-slate-900 mb-2">{type.title}</h2>
                                <p className="text-slate-600">{type.content}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}
