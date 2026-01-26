import { PageContainer } from "@/components/ui/page-container";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Briefcase, CheckCircle2, Globe, Zap } from "lucide-react";

export default async function BusinessPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const dict = (await getDictionary(lang as Locale)) as any;

    return (
        <div className="bg-slate-900 text-white min-h-screen">
            <PageContainer className="py-24">
                <div className="max-w-4xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-600/20 text-primary-400 text-sm font-bold mb-6">
                        <Briefcase className="h-4 w-4" />
                        B2B РЕШЕНИЯ
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
                        {dict.business.title}
                    </h1>
                    <p className="text-xl text-slate-400 mb-12 max-w-2xl leading-relaxed">
                        {dict.business.subtitle || "Професионални комуникационни решения с гарантирано качество (SLA) за малък и среден бизнес."}
                    </p>
                    <Button asChild size="lg" className="bg-primary-600 hover:bg-primary-700 text-white px-10 py-8 text-xl font-bold rounded-2xl">
                        <Link href={`/${lang}/quiz`}>{dict.business.cta}</Link>
                    </Button>
                </div>
            </PageContainer>

            <div className="bg-white text-slate-900 py-24">
                <PageContainer>
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <h2 className="text-3xl font-bold">Защо да изберете бизнес план през нас?</h2>
                            <div className="space-y-6">
                                {dict.business.features.map((feature: any, idx: number) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                                            <CheckCircle2 className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">{feature.title}</h3>
                                            <p className="text-slate-500">{feature.desc}</p>
                                        </div>
                                    </div>
                                ))}
                                <div className="flex gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                                        <Globe className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">Локална поддръжка</h3>
                                        <p className="text-slate-500">Директна връзка с технически екипи във вашия регион.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -inset-4 bg-primary-600/10 rounded-3xl blur-2xl"></div>
                            <div className="relative p-10 bg-slate-900 rounded-3xl text-white">
                                <Zap className="h-12 w-12 text-primary-400 mb-6" />
                                <h3 className="text-2xl font-bold mb-4">Бърза консултация</h3>
                                <p className="text-slate-400 mb-8">Оставете заявка и наш B2B експерт ще направи анализ на текущите ви разходи и инфраструктура.</p>
                                <Button variant="outline" className="w-full border-slate-700 hover:bg-slate-800" asChild>
                                    <Link href={`/${lang}/contact`}>Свържете се с нас</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </PageContainer>
            </div>
        </div>
    );
}
