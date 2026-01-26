"use client";

import { cn } from "@/lib/utils";

import { use, useEffect, useState } from "react";
import { PageContainer } from "@/components/ui/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    Users, AlertTriangle, ArrowRight, BarChart3, Clock, LogOut,
    TrendingUp, Target, ShieldCheck, Zap, MousePointer2
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Stats {
    total: number;
    today: number;
    duplicates: number;
    converted: number;
    qualified: number;
    sourceBreakdown: Record<string, number>;
}

export default function AdminDashboard({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = use(params);
    const router = useRouter();
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/leads");
            if (res.ok) {
                const data = await res.json();
                const total = data.length;
                const today = data.filter((l: any) => new Date(l.createdAt).toDateString() === new Date().toDateString()).length;
                const duplicates = data.filter((l: any) => l.isDuplicate).length;
                const converted = data.filter((l: any) => l.pipelineStatus === 'converted').length;
                const qualified = data.filter((l: any) => l.pipelineStatus === 'qualified').length;

                const sourceBreakdown: Record<string, number> = {};
                data.forEach((l: any) => {
                    const s = l.source || 'Direct';
                    sourceBreakdown[s] = (sourceBreakdown[s] || 0) + 1;
                });

                setStats({ total, today, duplicates, converted, qualified, sourceBreakdown });
                setError(false);
            } else if (res.status === 401) {
                router.push(`/${lang}/admin/login`);
            } else {
                setError(true);
            }
        } catch (e) {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleLogout = async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        sessionStorage.removeItem("admin_pwd");
        router.push("/");
        router.refresh();
    };

    if (loading) {
        return (
            <PageContainer className="py-24 flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Инициализиране на таблото...</p>
                </div>
            </PageContainer>
        );
    }

    if (error || !stats) {
        return (
            <PageContainer className="py-24 text-center">
                <div className="max-w-md mx-auto p-12 bg-white rounded-[3rem] shadow-xl shadow-slate-200/50">
                    <h1 className="text-2xl font-black text-slate-900 mb-4">Сесията е изтекла</h1>
                    <p className="text-slate-500 mb-8 font-medium">Моля, влезте в системата отново за достъп до бизнес показателите.</p>
                    <Button asChild className="h-12 px-8 rounded-2xl bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-200">
                        <Link href={`/${lang}/admin/login`} className="font-bold">Към вход</Link>
                    </Button>
                </div>
            </PageContainer>
        );
    }

    const conversionRate = stats.total > 0 ? ((stats.converted / stats.total) * 100).toFixed(1) : "0";

    return (
        <PageContainer className="py-20 lg:py-24">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-primary-200">
                            <BarChart3 className="h-6 w-6 text-white" />
                        </div>
                        Бизнес Портал
                    </h1>
                    <p className="text-slate-400 mt-2 font-medium flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Последно обновяване: {new Date().toLocaleTimeString('bg-BG')}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" size="lg" onClick={handleLogout} className="text-slate-400 hover:text-red-500 border-slate-200 bg-white rounded-2xl px-6 h-12 font-bold transition-all shadow-sm">
                        <LogOut className="h-4 w-4 mr-2" /> Изход
                    </Button>
                </div>
            </div>

            {/* Top Row: Mission Critical Stats */}
            <div className="grid md:grid-cols-4 gap-6 mb-12">
                <Card className="bg-white border-none shadow-2xl shadow-slate-200/40 rounded-[2.5rem] overflow-hidden group hover:scale-[1.02] transition-transform">
                    <CardContent className="p-8">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                                <Users className="h-6 w-6" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Всички</span>
                        </div>
                        <div className="text-5xl font-black text-slate-900 leading-none">{stats.total}</div>
                        <p className="text-xs text-slate-400 mt-4 font-bold flex items-center gap-1">
                            <TrendingUp className="h-3 w-3 text-green-500" /> +{stats.today} днес
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-white border-none shadow-2xl shadow-slate-200/40 rounded-[2.5rem] overflow-hidden group hover:scale-[1.02] transition-transform border-l-4 border-l-indigo-600">
                    <CardContent className="p-8">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                                <Target className="h-6 w-6" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Квалифицирани</span>
                        </div>
                        <div className="text-5xl font-black text-slate-900 leading-none">{stats.qualified}</div>
                        <p className="text-xs text-slate-400 mt-4 font-bold uppercase tracking-tighter">Потенциал за сделка</p>
                    </CardContent>
                </Card>

                <Card className="bg-primary-600 border-none shadow-2xl shadow-primary-200/40 rounded-[2.5rem] overflow-hidden group hover:scale-[1.02] transition-transform text-white">
                    <CardContent className="p-8">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-white/10 text-white rounded-2xl flex items-center justify-center">
                                <ShieldCheck className="h-6 w-6" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Затворени</span>
                        </div>
                        <div className="text-5xl font-black leading-none">{stats.converted}</div>
                        <p className="text-xs mt-4 font-bold text-primary-100 uppercase tracking-tighter">Успешни инсталации</p>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-none shadow-2xl shadow-slate-900/10 rounded-[2.5rem] overflow-hidden group hover:scale-[1.02] transition-transform text-white">
                    <CardContent className="p-8">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-white/5 text-primary-400 rounded-2xl flex items-center justify-center">
                                <Zap className="h-6 w-6" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Конверсия</span>
                        </div>
                        <div className="text-5xl font-black leading-none">{conversionRate}%</div>
                        <p className="text-xs mt-4 font-bold text-slate-400 uppercase tracking-tighter">Ефективност на фунията</p>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Row: Analytics & Navigation */}
            <div className="grid lg:grid-cols-12 gap-10 items-stretch">
                {/* Source Breakdown */}
                <Card className="lg:col-span-5 bg-white border-none shadow-2xl shadow-slate-200/40 rounded-[2.5rem] p-8 flex flex-col">
                    <CardHeader className="p-0 mb-8">
                        <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-3">
                            <MousePointer2 className="h-5 w-5 text-primary-600" />
                            Източници на Трафик
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 flex flex-col justify-center">
                        <div className="space-y-6">
                            {Object.entries(stats.sourceBreakdown).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([source, count], idx) => {
                                const percentage = ((count / stats.total) * 100).toFixed(0);
                                return (
                                    <div key={source} className="group">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-black text-slate-600 uppercase tracking-wide">{source}</span>
                                            <span className="text-xs font-black text-slate-900">{count} <span className="text-slate-300 ml-1">({percentage}%)</span></span>
                                        </div>
                                        <div className="h-3 bg-slate-50 rounded-full overflow-hidden shadow-inner">
                                            <div
                                                className={cn(
                                                    "h-full rounded-full transition-all duration-1000",
                                                    idx === 0 ? "bg-primary-600" :
                                                        idx === 1 ? "bg-indigo-500" :
                                                            idx === 2 ? "bg-blue-400" : "bg-slate-200"
                                                )}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Navigation and Call to Action */}
                <div className="lg:col-span-7 flex flex-col gap-8">
                    <div className="flex-1 bg-white p-12 rounded-[3.5rem] shadow-2xl shadow-slate-200/40 border-2 border-primary-50 flex flex-col justify-between items-center text-center relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8">
                            <div className="w-24 h-24 bg-primary-100/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
                        </div>

                        <div className="relative">
                            <div className="w-20 h-20 bg-primary-50 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-bounce transition-all">
                                <Users className="h-10 w-10 text-primary-600" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Управление на Запитвания</h2>
                            <p className="text-slate-500 max-w-sm mx-auto font-medium text-lg leading-relaxed">
                                Прегледайте новите {stats.today} запитвания от днес и ги разпределете към екипа.
                            </p>
                        </div>

                        <Button asChild size="lg" className="h-16 px-12 rounded-[2rem] bg-slate-900 hover:bg-slate-800 text-white shadow-2xl shadow-slate-900/20 text-lg font-black tracking-tight group overflow-hidden transition-all active:scale-[0.98]">
                            <Link href={`/${lang}/admin/leads`} className="flex items-center gap-4 relative z-10">
                                Влез в Lead Manager
                                <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                            </Link>
                        </Button>
                    </div>

                    <div className="bg-orange-600 p-8 rounded-[2.5rem] shadow-2xl shadow-orange-200 flex items-center justify-between text-white group cursor-pointer hover:bg-orange-700 transition-all">
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                                <AlertTriangle className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black leading-none">{stats.duplicates} Дубликата</h3>
                                <p className="text-orange-100 text-xs font-medium mt-2 opacity-80 uppercase tracking-widest">Открити от системата</p>
                            </div>
                        </div>
                        <ArrowRight className="h-6 w-6 opacity-40 group-hover:opacity-100 transition-all" />
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}
