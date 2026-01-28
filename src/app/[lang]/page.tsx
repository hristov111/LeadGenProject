import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Wifi, Smartphone, Tv, Building2, CheckCircle2, ShieldCheck, Zap, Scale, Target, Handshake, Users, Globe, TrendingDown, HelpCircle } from "lucide-react";
import { PageCTA } from "@/components/page-cta";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import { HeroButtons } from "@/components/hero-buttons";
import { StickyBottomBar } from "@/components/layout/sticky-bottom-bar";
import { ScrollReveal } from "@/components/scroll-reveal";
import { TypedHighlight } from "@/components/typed-highlight";
import { NumericCounter } from "@/components/numeric-counter";
import { StepTimeline } from "@/components/step-timeline";
import { FAQAccordion } from "@/components/faq-accordion";
import { trackEvent } from "@/lib/analytics";

export default async function Home({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict: any = await getDictionary(lang);

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-12 lg:pt-32 lg:pb-24">
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-sm font-medium text-primary-700 mb-6 animate-fadeIn">
            <span className="flex h-2 w-2 rounded-full bg-primary-600 mr-2"></span>
            {dict.hero.updated} {new Date().toLocaleDateString(lang, { month: 'long', year: 'numeric' })}
          </div>
          <h1 className="mx-auto max-w-4xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-7xl mb-4 animate-slideUp">
            {dict.hero.titlePrefix} <TypedHighlight text={dict.hero.titleHighlight} /> {dict.hero.titleSuffix}
          </h1>

          {/* Authority Line */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 mb-6 animate-slideUp opacity-0" style={{ animationFillMode: 'forwards', animationDelay: '0.1s' }}>
            <span className="hidden md:inline-block bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200 uppercase tracking-wider">{dict.hero.independentBadge}</span>
            <span className="text-slate-700 font-medium text-sm md:text-base">{dict.hero.authorityLine}</span>
          </div>

          <p className="mx-auto max-w-2xl text-lg text-slate-600 mb-3 animate-slideUp opacity-0" style={{ animationFillMode: 'forwards', animationDelay: '0.2s' }}>
            {dict.hero.subtitle}
          </p>

          <p className="mx-auto max-w-xl text-sm text-slate-500 mb-8 font-medium animate-slideUp opacity-0" style={{ animationFillMode: 'forwards', animationDelay: '0.3s' }}>
            <CheckCircle2 className="inline h-4 w-4 mr-1 text-green-500" /> {dict.hero.trustLine}
          </p>

          <div className="text-sm font-semibold text-primary-700 bg-primary-50 inline-block px-4 py-1.5 rounded-full mb-8 animate-slideUp opacity-0" style={{ animationFillMode: 'forwards', animationDelay: '0.4s' }}>
            {dict.hero.microTrust}
          </div>

          <HeroButtons lang={lang} dict={dict} />

          <p className="text-xs text-slate-400 mt-6 animate-fadeIn opacity-70">
            {dict.hero.cityReassurance}
          </p>
        </div>

        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl -z-10 pointer-events-none opacity-50">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-20 right-10 w-72 h-72 bg-secondary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-slate-50 border-b border-slate-200 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{dict.trust?.title || "Защо ние?"}</h2>
          </div>
          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {dict.trust?.cards?.map((card: any, i: number) => {
                const Icons = [Scale, Target, Handshake];
                const Icon = Icons[i];
                return (
                  <div key={i} className="reveal-item reveal-on-scroll trust-card bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
                    <div className="mb-5 p-3 rounded-full bg-primary-50">
                      <Icon className="h-6 w-6 text-primary-600" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-3 text-lg">{card.title}</h3>
                    <p className="text-slate-600 leading-relaxed text-sm">{card.desc}</p>
                  </div>
                );
              })}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="bg-white py-16 border-b border-slate-100 overflow-hidden">
        <div className="container mx-auto px-4">
          <ScrollReveal staggerDelay={100} threshold={0.2}>
            <div className="grid grid-cols-2 gap-y-12 md:grid-cols-4 text-center">
              {[
                {
                  label: dict.stats.familiesHelped,
                  value: <NumericCounter target={2500} suffix="+" />,
                  icon: Users
                },
                {
                  label: dict.stats.providersCompared,
                  value: dict.stats.allMajor,
                  icon: Globe
                },
                {
                  label: dict.stats.averageSavings,
                  value: <NumericCounter target={30} suffix="%" />,
                  icon: TrendingDown
                },
                {
                  label: dict.stats.serviceCost,
                  value: "0 BGN",
                  icon: ShieldCheck
                },
              ].map((stat: any, i: number) => (
                <div key={i} className="reveal-item reveal-on-scroll flex flex-col items-center">
                  <div className="mb-4 text-primary-600 opacity-80">
                    <stat.icon className="h-6 w-6" strokeWidth={1.5} />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                  <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">{stat.label}</div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Services */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">{dict.services.title}</h2>
          <p className="text-slate-500 mt-2">{dict.services.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Wifi, ...dict.services.internet },
            { icon: Smartphone, ...dict.services.mobile },
            { icon: Tv, ...dict.services.tv },
            { icon: Building2, ...dict.services.business },
          ].map((item: any, i: number) => {
            const isClickable = item.title === dict.services.internet.title || item.title === dict.services.mobile.title;
            const href = item.title === dict.services.internet.title ? `/${lang}/internet` : item.title === dict.services.mobile.title ? `/${lang}/mobile-plans` : "#";

            const Content = (
              <CardContent className="p-6 flex flex-col items-center text-center pt-8">
                <div className="mb-4 rounded-full bg-primary-50 p-4 group-hover:bg-primary-100 transition-colors">
                  <item.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{item.title}</h3>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </CardContent>
            );

            return isClickable ? (
              <Link href={href} key={i}>
                <Card className="group hover:border-primary-200 cursor-pointer transition-all h-full">
                  {Content}
                </Card>
              </Link>
            ) : (
              <Card key={i} className="group hover:border-primary-200 cursor-pointer transition-all h-full">
                {Content}
              </Card>
            );
          })}
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="bg-white py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-slate-900">{dict.howItWorks.title}</h2>
            <p className="text-slate-500 mt-2">{dict.howItWorks.subtitle}</p>
          </div>

          <StepTimeline dict={dict} />
        </div>
      </section>

      {/* Primary CTA Section */}
      <section className="container mx-auto px-4 max-w-5xl">
        <PageCTA
          title={dict.ctas?.landingReady || "Готови ли сте да намерите подходяща услуга?"}
          subtitle={dict.ctas?.landingSubtitle || "Отнема по-малко от минута, за да намерите най-добрата оферта за вашия адрес."}
          primaryCtaText={dict.hero.ctaPrimary}
          primaryHref={`/${lang}/quiz`}
          secondaryText={dict.ctas?.landingContact || "Свържи се с нас"}
          secondaryHref={`/${lang}/contact`}
          eventName="landing_mid_cta"
        />
      </section>

      {/* FAQ */}
      <section id="faq" className="container mx-auto px-4 max-w-3xl py-24">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">{dict.faq.title}</h2>

        <FAQAccordion items={dict.faq.items} />
      </section>

      <StickyBottomBar lang={lang} dict={dict} />
    </div>
  );
}
