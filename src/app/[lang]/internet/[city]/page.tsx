import { PageContainer } from "@/components/ui/page-container";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin, Wifi, Phone, MonitorPlay, ChevronRight } from "lucide-react";

export default async function CityLandingPage({
    params,
}: {
    params: Promise<{ lang: string; city: string }>;
}) {
    const { lang, city: cityParam } = await params;
    const dict = (await getDictionary(lang as Locale)) as any;

    // Capitalize first letter of city for display
    const city = cityParam.charAt(0).toUpperCase() + cityParam.slice(1);

    return (
        <div className="bg-white">
            <section className="relative py-24 bg-slate-50 border-b border-slate-200 overflow-hidden">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary-600/5 rounded-full blur-3xl"></div>
                <PageContainer className="relative">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-2 text-primary-600 font-bold mb-4">
                            <MapPin className="h-5 w-5" />
                            {city} • България
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
                            Намерете най-добрия интернет и ТВ в <span className="text-primary-600">{city}</span>
                        </h1>
                        <p className="text-lg text-slate-600 mb-10 leading-relaxed uppercase tracking-wide font-medium">
                            Сравняваме Vivacom, A1, Yettel и локални оператори за вашия адрес в {city}.
                        </p>
                        <Button asChild size="lg" className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-7 text-lg font-bold rounded-xl">
                            <Link href={`/${lang}/quiz`}>
                                Провери покритие в {city}
                                <ChevronRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </div>
                </PageContainer>
            </section>

            <section className="py-24">
                <PageContainer>
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Покритие и услуги в {city}</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto">
                            Независимо дали живеете в центъра на {city} или в покрайнините, ние ще ви помогнем да намерите най-бързата връзка.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-2xl border border-slate-100 bg-white hover:shadow-lg transition-shadow">
                            <Wifi className="h-10 w-10 text-primary-600 mb-6" />
                            <h3 className="text-xl font-bold mb-3">Оптичен Интернет</h3>
                            <p className="text-slate-500 text-sm">Най-висока скорост за стрийминг и работа от вкъщи в {city}.</p>
                        </div>
                        <div className="p-8 rounded-2xl border border-slate-100 bg-white hover:shadow-lg transition-shadow">
                            <MonitorPlay className="h-10 w-10 text-primary-600 mb-6" />
                            <h3 className="text-xl font-bold mb-3">Интерактивна Телевизия</h3>
                            <p className="text-slate-500 text-sm">Богати спортни канали и филмови пакети с възможност за връщане.</p>
                        </div>
                        <div className="p-8 rounded-2xl border border-slate-100 bg-white hover:shadow-lg transition-shadow">
                            <Phone className="h-10 w-10 text-primary-600 mb-6" />
                            <h3 className="text-xl font-bold mb-3">Мобилни Планове</h3>
                            <p className="text-slate-500 text-sm">Неограничени минути и мегабайти с отлично 5G покритие в региона.</p>
                        </div>
                    </div>
                </PageContainer>
            </section>

            <section className="py-20 bg-primary-600 text-white">
                <PageContainer className="text-center">
                    <h2 className="text-3xl font-bold mb-6">Готови ли сте да спестите?</h2>
                    <p className="text-primary-100 mb-10 max-w-xl mx-auto">
                        Нашите консултанти познават спецификите на мрежата в {city} и ще ви насочат към най-актуалните оферти.
                    </p>
                    <Button asChild variant="secondary" size="lg" className="px-10 py-7 text-lg font-bold rounded-xl text-primary-600 bg-white hover:bg-slate-100">
                        <Link href={`/${lang}/quiz`}>Започнете безплатна проверка</Link>
                    </Button>
                </PageContainer>
            </section>
        </div>
    );
}
