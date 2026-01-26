import { PageContainer } from "@/components/ui/page-container";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MessageSquare, Send } from "lucide-react";

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
                        <div className="flex gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                                <Mail className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 mb-1">Имейл</h3>
                                <p className="text-slate-500">info@telecombglabs.com</p>
                            </div>
                        </div>

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
                                <form className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">{dict.contact.form.name}</label>
                                            <Input placeholder={lang === 'bg' ? "Иван Иванов" : "John Doe"} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">{dict.contact.form.email}</label>
                                            <Input placeholder={lang === 'bg' ? "ivan@example.com" : "john@example.com"} type="email" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">{dict.contact.form.message}</label>
                                        <textarea
                                            className="flex min-h-[160px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            placeholder={lang === 'bg' ? "Как можем да ви помогнем?" : "How can we help?"}
                                        ></textarea>
                                    </div>
                                    <Button className="w-full bg-primary-600 hover:bg-primary-700 text-white py-6 text-lg font-bold">
                                        {dict.contact.form.submit}
                                        <Send className="ml-2 h-5 w-5" />
                                    </Button>
                                </form>
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
