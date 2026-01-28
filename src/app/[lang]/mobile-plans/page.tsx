
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Map, Smartphone, Wifi, ArrowRight, HelpCircle, ShieldCheck, Zap, Globe, Phone } from "lucide-react";
import { PageCTA } from "@/components/page-cta";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import { StickyBottomBar } from "@/components/layout/sticky-bottom-bar";
import { FAQAccordion } from "@/components/faq-accordion";

export const metadata = {
    title: "Mobile Plans - TelecomBGLabs",
    description: "Find the best mobile plan for your needs.",
};

export default async function MobilePlans({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dict: any = await getDictionary(lang);
    const t = dict.mobilePlans;

    return (
        <div className="flex flex-col gap-16 pb-16">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-16 pb-12 lg:pt-32 lg:pb-24 bg-gradient-to-b from-primary-50 to-white">
                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="inline-flex items-center rounded-full border border-primary-200 bg-white px-3 py-1 text-sm font-medium text-primary-700 mb-6 shadow-sm">
                        <span className="flex h-2 w-2 rounded-full bg-primary-600 mr-2"></span>
                        {t.hero.trust.independent}
                    </div>
                    <h1 className="mx-auto max-w-4xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl mb-6">
                        {t.hero.title}
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-slate-600 mb-8 leading-relaxed">
                        {t.hero.subtitle}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                        <Link href={`/${lang}/quiz`}>
                            <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all">
                                {t.hero.cta} <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 text-sm font-medium text-slate-500">
                        <span className="flex items-center"><CheckCircle2 className="mr-1 h-4 w-4 text-green-500" /> {t.hero.trust.free}</span>
                        <span className="flex items-center"><CheckCircle2 className="mr-1 h-4 w-4 text-green-500" /> {t.hero.trust.no_obligation}</span>
                        <span className="flex items-center"><ShieldCheck className="mr-1 h-4 w-4 text-primary-600" /> {t.hero.trust.independent}</span>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-900">{t.howItWorks.title}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
                    {/* Connector Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-slate-100 -z-10 transform scale-x-75"></div>

                    {t.howItWorks.steps.map((step: any, i: number) => (
                        <div key={i} className="flex flex-col items-center text-center bg-white p-6 rounded-xl border border-slate-100 shadow-sm relative z-10">
                            <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xl mb-4 border-4 border-white shadow-sm">
                                {i + 1}
                            </div>
                            <h3 className="font-bold text-lg text-slate-900 mb-2">{step.title}</h3>
                            <p className="text-slate-600">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Data Usage Education */}
            <section className="bg-slate-50 py-16">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">{t.dataUsage.title}</h2>
                        <p className="text-slate-600">{t.dataUsage.explanation}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="border-0 shadow-md">
                            <CardContent className="p-6 flex flex-col items-center text-center">
                                <div className="p-3 bg-blue-100 rounded-full text-blue-600 mb-4"><Smartphone className="h-6 w-6" /></div>
                                <p className="font-semibold text-slate-900">{t.dataUsage.scenarios.social}</p>
                            </CardContent>
                        </Card>
                        <Card className="border-0 shadow-md relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-primary-500 text-white text-xs px-2 py-1 rounded-bl-lg font-bold">Popular</div>
                            <CardContent className="p-6 flex flex-col items-center text-center">
                                <div className="p-3 bg-primary-100 rounded-full text-primary-600 mb-4"><Zap className="h-6 w-6" /></div>
                                <p className="font-semibold text-slate-900">{t.dataUsage.scenarios.video}</p>
                            </CardContent>
                        </Card>
                        <Card className="border-0 shadow-md">
                            <CardContent className="p-6 flex flex-col items-center text-center">
                                <div className="p-3 bg-indigo-100 rounded-full text-indigo-600 mb-4"><Wifi className="h-6 w-6" /></div>
                                <p className="font-semibold text-slate-900">{t.dataUsage.scenarios.work}</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Coverage & Maps */}
            <section className="container mx-auto px-4 max-w-4xl">
                <div className="flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1">
                        <div className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 mb-4 border border-amber-100">
                            <Map className="mr-1.5 h-3 w-3" /> Reality Check
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">{t.coverage.title}</h2>
                        <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                            {t.coverage.text}
                        </p>
                        <div className="p-4 bg-slate-50 border-l-4 border-primary-500 rounded-r-lg">
                            <p className="font-medium text-slate-800 italic">
                                "{t.coverage.highlight}"
                            </p>
                        </div>
                    </div>
                    <div className="flex-1 flex justify-center">
                        <div className="relative w-full max-w-xs aspect-square bg-slate-100 rounded-2xl flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-tr from-slate-200 to-slate-50 opacity-50"></div>
                            <Map className="h-24 w-24 text-slate-300 relative z-10" />
                            {/* Abstract signal illustration */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-primary-200 rounded-full animate-pulse"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-primary-300 rounded-full animate-ping opacity-20"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Number Portability */}
            <section className="bg-white py-12 border-y border-slate-100">
                <div className="container mx-auto px-4 max-w-3xl text-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8">{t.portability.title}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
                        {t.portability.points.map((point: string, i: number) => (
                            <div key={i} className="flex items-start">
                                <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                                <span className="text-slate-700">{point}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Dynamic City Region */}
            <section className="container mx-auto px-4 max-w-4xl text-center">
                <div className="p-8 bg-slate-900 rounded-2xl text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-5 rounded-full blur-3xl"></div>
                    <h2 className="text-2xl font-bold mb-4 relative z-10">
                        {t.dynamicCity.title.replace('{{city}}', 'Bulgaria')}
                    </h2>
                    <p className="text-slate-300 relative z-10 max-w-2xl mx-auto">
                        {t.dynamicCity.text.replace('{{city}}', 'Bulgaria')}
                    </p>
                </div>
                <p className="text-xs text-slate-400 mt-4">* {t.coverage.highlight}</p>
            </section>

            {/* Use Cases */}
            <section className="container mx-auto px-4">
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-bold text-slate-900">{t.useCases.title}</h2>
                    <p className="text-slate-500 mt-2">{t.useCases.explanation}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    <Card className="cursor-pointer hover:border-primary-300 transition-all hover:shadow-md group">
                        <CardContent className="p-6 flex flex-col items-center text-center pt-8">
                            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-full group-hover:scale-110 transition-transform"><Smartphone className="h-8 w-8" /></div>
                            <h3 className="font-bold text-slate-900">{t.useCases.options.data}</h3>
                        </CardContent>
                    </Card>
                    <Card className="cursor-pointer hover:border-primary-300 transition-all hover:shadow-md group">
                        <CardContent className="p-6 flex flex-col items-center text-center pt-8">
                            <div className="mb-4 p-3 bg-blue-50 text-blue-600 rounded-full group-hover:scale-110 transition-transform"><Globe className="h-8 w-8" /></div>
                            <h3 className="font-bold text-slate-900">{t.useCases.options.travel}</h3>
                        </CardContent>
                    </Card>
                    <Card className="cursor-pointer hover:border-primary-300 transition-all hover:shadow-md group">
                        <CardContent className="p-6 flex flex-col items-center text-center pt-8">
                            <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-full group-hover:scale-110 transition-transform"><Phone className="h-8 w-8" /></div>
                            <h3 className="font-bold text-slate-900">{t.useCases.options.talk}</h3>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* CTA Repeat */}
            <section className="container mx-auto px-4 max-w-3xl">
                <PageCTA
                    title={t.hero.title}
                    subtitle={t.hero.subtitle}
                    primaryCtaText={t.hero.cta}
                    primaryHref={`/${lang}/quiz`}
                    secondaryText={dict.hero.ctaDirect}
                    secondaryHref={`/${lang}/contact`}
                    eventName="mobile_plans_bottom_cta"
                />
            </section>

            {/* FAQ */}
            <section className="container mx-auto px-4 max-w-3xl py-12">
                <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">{t.faq.title}</h2>
                <FAQAccordion items={t.faq.items} />
            </section>

            <StickyBottomBar lang={lang} dict={dict} />
        </div>
    );
}
