import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Check, Info, Shield, Zap, Wifi, Globe, MapPin, Clock } from "lucide-react";
import Link from "next/link";
import { PageCTA } from "@/components/page-cta";
import { StickyBottomBar } from "@/components/layout/sticky-bottom-bar";
import { FAQAccordion } from "@/components/faq-accordion";

export default async function InternetLandingPage({
    params,
}: {
    params: Promise<{ lang: Locale }>;
}) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const content = dict.internet_landing;

    // Placeholder for city, could be dynamic based on user location or query param in future
    const cityPlaceholder = "Sofia";

    return (
        <div className="flex flex-col gap-16 pb-16 min-h-screen">
            {/* 1. HERO SECTION */}
            <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white pt-16 pb-12 lg:pt-32 lg:pb-24">
                <div className="container px-4 md:px-6 mx-auto text-center z-10 relative">
                    <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-blue-100 text-blue-900 mb-6 animate-fadeIn">
                        <Shield className="mr-2 h-4 w-4" />
                        {content.hero.trust.independent}
                    </div>
                    <h1 className="mx-auto max-w-4xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-7xl mb-6 leading-tight animate-slideUp">
                        {content.hero.title}
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-slate-600 mb-10 leading-relaxed animate-slideUp" style={{ animationDelay: '0.1s' }}>
                        {content.hero.subtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slideUp" style={{ animationDelay: '0.2s' }}>
                        <Button size="lg" className="w-full sm:w-auto min-h-14 h-auto py-4 px-6 text-base sm:text-lg font-bold shadow-lg shadow-blue-500/20 bg-blue-600 hover:bg-blue-700 transition-[transform,box-shadow] duration-200 whitespace-normal" asChild>
                            <Link href={`/${lang}/quiz`}>{content.hero.cta}</Link>
                        </Button>
                    </div>
                    <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-6 text-sm text-slate-500 font-medium animate-slideUp" style={{ animationDelay: '0.3s' }}>
                        <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-500" />
                            {content.hero.trust.free}
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-500" />
                            {content.hero.trust.no_obligation}
                        </div>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-100/40 rounded-full blur-3xl -z-10" />
                <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] bg-indigo-100/40 rounded-full blur-3xl -z-10" />
            </section>

            {/* 2. HOW IT WORKS */}
            <section className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-slate-900 mb-4">{content.how_it_works.title}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {content.how_it_works.steps.map((step: any, index: number) => (
                        <div key={index} className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold mb-6 shadow-lg shadow-blue-500/30">
                                {index + 1}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                            <p className="text-slate-600">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. EDUCATIONAL SECTION */}
            <section className="py-20 bg-slate-50">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-slate-900 mb-4">{content.educational.title}</h2>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Optic */}
                        <Card className="border-0 shadow-lg hover:-translate-y-1 transition-transform duration-300">
                            <CardHeader className="pb-4">
                                <div className="w-12 h-12 rounded-lg bg-green-100 text-green-600 flex items-center justify-center mb-4">
                                    <Zap className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-2xl">{content.educational.optic.title}</CardTitle>
                                <CardDescription className="text-base font-medium text-green-600 mt-1">{content.educational.optic.subtitle}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-slate-600">{content.educational.optic.desc}</p>
                                <div className="pt-4 border-t border-slate-100">
                                    <div className="flex items-start gap-2 mb-2">
                                        <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                                        <span className="text-sm font-medium text-slate-700">{content.educational.optic.pros}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <Info className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                                        <span className="text-sm font-medium text-slate-700">{content.educational.optic.cons}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Cable */}
                        <Card className="border-0 shadow-lg hover:-translate-y-1 transition-transform duration-300">
                            <CardHeader className="pb-4">
                                <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                                    <Globe className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-2xl">{content.educational.cable.title}</CardTitle>
                                <CardDescription className="text-base font-medium text-blue-600 mt-1">{content.educational.cable.subtitle}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-slate-600">{content.educational.cable.desc}</p>
                                <div className="pt-4 border-t border-slate-100">
                                    <div className="flex items-start gap-2 mb-2">
                                        <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                                        <span className="text-sm font-medium text-slate-700">{content.educational.cable.pros}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <Info className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                                        <span className="text-sm font-medium text-slate-700">{content.educational.cable.cons}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Mobile/5G */}
                        <Card className="border-0 shadow-lg hover:-translate-y-1 transition-transform duration-300">
                            <CardHeader className="pb-4">
                                <div className="w-12 h-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                                    <Wifi className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-2xl">{content.educational.mobile.title}</CardTitle>
                                <CardDescription className="text-base font-medium text-purple-600 mt-1">{content.educational.mobile.subtitle}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-slate-600">{content.educational.mobile.desc}</p>
                                <div className="pt-4 border-t border-slate-100">
                                    <div className="flex items-start gap-2 mb-2">
                                        <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                                        <span className="text-sm font-medium text-slate-700">{content.educational.mobile.pros}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <Info className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                                        <span className="text-sm font-medium text-slate-700">{content.educational.mobile.cons}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* 4. KEY FACTORS */}
            <section className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-slate-900 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-800 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold tracking-tight text-white mb-8 text-center">{content.key_factors.title}</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {content.key_factors.items.map((item: string, index: number) => (
                                    <div key={index} className="flex items-start p-4 bg-slate-800/50 rounded-xl border border-slate-700 backdrop-blur-sm">
                                        <div className="bg-blue-600/20 p-2 rounded-lg mr-4">
                                            <Check className="h-5 w-5 text-blue-400" />
                                        </div>
                                        <span className="text-slate-200 font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. CITY SECTION (Dynamic Placeholder) */}
            <section className="py-20 bg-slate-50">
                <div className="container px-4 md:px-6 mx-auto text-center">
                    <div className="inline-flex items-center rounded-full bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-700 mb-6">
                        <MapPin className="mr-2 h-4 w-4" />
                        {content.city_section.title.replace("{{city}}", cityPlaceholder)}
                    </div>
                    <p className="text-slate-500 max-w-2xl mx-auto mb-12">
                        {content.city_section.description.replace("{{city}}", cityPlaceholder)}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <h3 className="font-bold text-lg mb-4 text-slate-900">{content.city_section.availability_title.replace("{{city}}", cityPlaceholder)}</h3>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {/* Placeholder tags */}
                                <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">Fiber (GPON)</span>
                                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">DOCSIS 3.0</span>
                                <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">5G Home</span>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <h3 className="font-bold text-lg mb-4 text-slate-900">{content.city_section.problems_title.replace("{{city}}", cityPlaceholder)}</h3>
                            <p className="text-sm text-slate-600">
                                {content.city_section.coverage_disclaimer}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. CTA REPEAT (Replaced with PageCTA) */}
            <section className="container mx-auto px-4 max-w-5xl">
                <PageCTA
                    title={content.cta_repeat.button}
                    subtitle={content.hero.subtitle}
                    primaryCtaText={content.hero.cta}
                    primaryHref={`/${lang}/quiz`}
                    eventName="internet_bottom_cta"
                />
            </section>

            {/* 7. FAQ (Replaced with FAQAccordion) */}
            <section className="container mx-auto px-4 max-w-3xl pb-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">{content.faq.title}</h2>
                </div>
                <FAQAccordion items={content.faq.questions} />
            </section>

            <StickyBottomBar lang={lang} dict={dict} />
        </div>
    );
}
