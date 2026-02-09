"use client";

import { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
    Filter, RefreshCw, LogOut, ChevronRight, Phone, Mail,
    MessageSquare, User, Calendar, ExternalLink, Shield,
    CheckCircle2, AlertCircle, Clock, Trash2, Save, X, MoreHorizontal
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { ErrorBanner } from "@/components/ui/error-banner";

interface Lead {
    id: string;
    createdAt: string;
    name: string;
    phone: string;
    email: string | null;
    city: string;
    serviceType: string;
    usageIntent: string;
    timeline: string;
    budget: string | null;
    status: string;
    notes: string | null;

    // Source Tracking
    source: string | null;
    campaign: string | null;
    medium: string | null;
    content: string | null;
    term: string | null;
    referrer: string | null;
    formName: string | null;

    // Assignment & Workflow
    assignedTo: string | null;
    assignedAt: string | null;
    followUpAt: string | null;
    nextAction: string | null;
    callOutcome: string | null;
    pipelineStatus: string;

    // Operator / Partner Feedback
    operatorAccepted: boolean | null;
    activationDate: string | null;
    operatorNotes: string | null;

    // Compliance & Security
    ipAddress: string | null;
    consentTimestamp: string | null;
    policyVersion: string | null;

    // Duplicate handling
    isDuplicate: boolean;
    duplicateCount: number;
    qualityScore: number;
    originalLeadId: string | null;
}

const PIPELINE_STATUSES = [
    { id: 'new', label: 'Ново', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { id: 'contacted', label: 'Свързан', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
    { id: 'qualified', label: 'Квалифициран', color: 'bg-amber-100 text-amber-700 border-amber-200' },
    { id: 'converted', label: 'Конвертиран ✅', color: 'bg-green-100 text-green-700 border-green-200' },
    { id: 'rejected', label: 'Отхвърлен ❌', color: 'bg-red-100 text-red-700 border-red-200' },
];

const AGENTS = ['Александър', 'Мария', 'Николай', 'Елена'];

export default function AdminPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = use(params);
    const router = useRouter();

    const [leads, setLeads] = useState<Lead[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [filterDuplicate, setFilterDuplicate] = useState<"all" | "original" | "duplicate">("all");
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [isUpdating, setIsUpdating] = useState<string | null>(null);

    const fetchLeads = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/leads");
            if (res.ok) {
                const data = await res.json();
                setLeads(data);
                setError("");
            } else if (res.status === 401) {
                router.push(`/${lang}/admin/login`);
            } else {
                setError("Грешка при зареждане на данните");
            }
        } catch (e) {
            setError("Грешка при комуникация със сървъра");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const updateLead = async (id: string, updates: Partial<Lead>) => {
        setIsUpdating(id);
        try {
            const res = await fetch("/api/leads", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, ...updates }),
            });

            if (res.ok) {
                const updated = await res.json();
                setLeads(leads.map(l => l.id === id ? updated : l));
                if (selectedLead?.id === id) setSelectedLead(updated);
            } else {
                alert("Грешка при обновяване");
            }
        } catch (e) {
            alert("Грешка при комуникация");
        } finally {
            setIsUpdating(null);
        }
    };

    const handleLogout = async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        sessionStorage.removeItem("admin_pwd");
        router.push("/");
        router.refresh();
    };

    const filteredLeads = leads.filter(l => {
        if (filterDuplicate === "original") return !l.isDuplicate;
        if (filterDuplicate === "duplicate") return l.isDuplicate;
        return true;
    });

    const getPipelineStatus = (id: string) => PIPELINE_STATUSES.find(s => s.id === id) || PIPELINE_STATUSES[0];

    return (
        <div className="min-h-screen bg-slate-50/50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 font-bold text-slate-800">
                            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                                <Shield className="text-white h-4 w-4" />
                            </div>
                            <span>Lead Manager Pro <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded ml-1 text-slate-500 font-medium">v2.0</span></span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-500 hover:text-red-600 rounded-xl">
                            <LogOut className="h-4 w-4 mr-2" /> Изход
                        </Button>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 py-8">
                {/* Dashboard Stats / Top Bar */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Запитвания</h1>
                        <p className="text-slate-500 mt-1 flex items-center gap-2">
                            <span>Общо: {leads.length}</span>
                            <span className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                            <span className="text-primary-600 font-bold">{filteredLeads.length} филтрирани</span>
                            <span className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                            <span className="text-amber-600 font-bold">{leads.filter(l => l.pipelineStatus === 'new').length} нови</span>
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
                            {[
                                { id: 'all', label: 'Всички' },
                                { id: 'original', label: 'Уникални' },
                                { id: 'duplicate', label: 'Повторни' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setFilterDuplicate(tab.id as any)}
                                    className={cn(
                                        "px-4 py-1.5 text-xs font-semibold rounded-lg transition-all",
                                        filterDuplicate === tab.id
                                            ? "bg-primary-600 text-white shadow-md shadow-primary-200"
                                            : "text-slate-500 hover:bg-slate-50"
                                    )}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <Button variant="outline" size="sm" onClick={fetchLeads} disabled={isLoading} className="bg-white hover:bg-slate-50 border-slate-200 h-9 px-4 rounded-xl shadow-sm font-bold text-slate-700">
                            <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} /> Опресни
                        </Button>

                        <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-white h-9 px-4 rounded-xl shadow-lg border-2 border-slate-800 transition-all active:scale-95" onClick={() => {
                            const csv = leads.map(l => `${l.createdAt},${l.name},${l.phone},${l.city},${l.serviceType},${l.source},${l.assignedTo},${l.pipelineStatus}`).join("\n");
                            const blob = new Blob([`Date,Name,Phone,City,Service,Source,Agent,Status\n` + csv], { type: 'text/csv' });
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `leads_export_${new Date().toISOString().split('T')[0]}.csv`;
                            a.click();
                        }}>Експорт</Button>
                    </div>
                </div>

                {/* Error Banner */}
                <ErrorBanner error={error} onDismiss={() => setError("")} />

                {/* Main Content Area */}
                {isLoading && leads.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-dashed border-slate-300">
                        <RefreshCw className="h-12 w-12 text-slate-200 animate-spin mb-4" />
                        <p className="text-slate-400 font-medium">Зареждане на базата данни...</p>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden md:block bg-white rounded-3xl border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50/70 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4">Клиент / Източник</th>
                                        <th className="px-6 py-4">Контакт / Град</th>
                                        <th className="px-6 py-4">Качество</th>
                                        <th className="px-6 py-4">Отговорник</th>
                                        <th className="px-6 py-4">Статус</th>
                                        <th className="px-6 py-4 text-right">Действия</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredLeads.map((lead) => {
                                        const status = getPipelineStatus(lead.pipelineStatus);
                                        return (
                                            <tr key={lead.id} className={cn(
                                                "hover:bg-slate-50/50 transition-all group",
                                                lead.isDuplicate && "bg-orange-50/10",
                                                isUpdating === lead.id && "bg-slate-100 opacity-70"
                                            )}>
                                                {/* Client / Source Cluster */}
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                                                            {lead.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="font-extrabold text-slate-900 group-hover:text-primary-700 transition-colors flex items-center gap-2">
                                                                {lead.name}
                                                                {lead.isDuplicate && (
                                                                    <span className="text-[9px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full uppercase font-black">Дубликат</span>
                                                                )}
                                                            </div>
                                                            <div className="text-[10px] flex items-center gap-2 text-slate-400 mt-0.5">
                                                                <span className="font-bold uppercase tracking-tighter text-slate-500">{lead.source || 'Direct'}</span>
                                                                <span className="w-1 h-1 bg-slate-200 rounded-full" />
                                                                <span>{new Date(lead.createdAt).toLocaleDateString('bg-BG')}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Contact Details */}
                                                <td className="px-6 py-5">
                                                    <div className="font-black text-slate-900">{lead.phone}</div>
                                                    <div className="text-[10px] text-slate-400 font-bold uppercase">{lead.city} • {lead.serviceType}</div>
                                                </td>

                                                {/* Quality Score Display */}
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-1.5">
                                                        <div className={cn(
                                                            "h-2 w-10 rounded-full overflow-hidden bg-slate-100 flex shadow-inner",
                                                        )}>
                                                            <div
                                                                className={cn(
                                                                    "h-full transition-all duration-1000",
                                                                    lead.qualityScore >= 2 ? "bg-green-500" :
                                                                        lead.qualityScore > 0 ? "bg-amber-400" : "bg-red-400"
                                                                )}
                                                                style={{ width: `${Math.min(100, Math.max(10, (lead.qualityScore + 2) * 25))}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-[10px] font-black text-slate-500">{lead.qualityScore}</span>
                                                    </div>
                                                </td>

                                                {/* Assigned Agent Selection */}
                                                <td className="px-6 py-5">
                                                    <select
                                                        className="bg-transparent border-none text-xs font-bold text-slate-600 focus:ring-0 cursor-pointer p-0 hover:text-primary-600"
                                                        value={lead.assignedTo || ''}
                                                        onChange={(e) => updateLead(lead.id, { assignedTo: e.target.value })}
                                                    >
                                                        <option value="">Незададен</option>
                                                        {AGENTS.map(a => <option key={a} value={a}>{a}</option>)}
                                                    </select>
                                                </td>

                                                {/* Pipeline Status Selector */}
                                                <td className="px-6 py-5">
                                                    <select
                                                        className={cn(
                                                            "px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-wide cursor-pointer focus:ring-2",
                                                            status.color
                                                        )}
                                                        value={lead.pipelineStatus}
                                                        onChange={(e) => updateLead(lead.id, { pipelineStatus: e.target.value })}
                                                    >
                                                        {PIPELINE_STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                                                    </select>
                                                </td>

                                                {/* Actions */}
                                                <td className="px-6 py-5 text-right space-x-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 rounded-lg hover:bg-primary-50 hover:text-primary-600"
                                                        onClick={() => setSelectedLead(lead)}
                                                    >
                                                        <ChevronRight className="h-5 w-5" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile View */}
                        <div className="md:hidden space-y-4">
                            {filteredLeads.map((lead) => (
                                <Card key={lead.id} className={cn(
                                    "p-5 border shadow-sm rounded-[2rem]",
                                    lead.pipelineStatus === 'new' ? "border-blue-100 shadow-blue-100/20" : "border-slate-100"
                                )}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex gap-3">
                                            <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center font-black text-slate-400">
                                                {lead.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900">{lead.name}</div>
                                                <div className="text-[10px] text-slate-400 font-black uppercase">{lead.serviceType} • {lead.city}</div>
                                            </div>
                                        </div>
                                        <div className={cn("px-2 py-0.5 rounded-full text-[9px] font-black uppercase border", getPipelineStatus(lead.pipelineStatus).color.split(' ')[0], "border-transparent bg-opacity-50")}>
                                            {getPipelineStatus(lead.pipelineStatus).label}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-4 bg-slate-50/50 p-3 rounded-2xl border border-slate-50">
                                        <div>
                                            <div className="text-[8px] text-slate-400 font-black uppercase tracking-widest">Тел.</div>
                                            <div className="text-sm font-black text-slate-800">{lead.phone}</div>
                                        </div>
                                        <div>
                                            <div className="text-[8px] text-slate-400 font-black uppercase tracking-widest">Източник</div>
                                            <div className="text-sm font-bold text-slate-600 truncate">{lead.source || 'Direct'}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1">
                                            <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center">
                                                <User className="h-3 w-3 text-white" />
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-500">{lead.assignedTo || 'Свободен'}</span>
                                        </div>
                                        <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl font-black text-[11px] border-2 border-slate-100" onClick={() => setSelectedLead(lead)}>
                                            Преглед
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {filteredLeads.length === 0 && (
                            <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 shadow-sm">
                                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                                    <Filter className="text-slate-200 h-12 w-12" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Няма намерени резултати</h3>
                                <p className="text-slate-400 max-w-xs mx-auto text-sm">Опитайте да промените филтрите или проверете за нови запитвания.</p>
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Lead Details Modal */}
            <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
                <DialogContent className="max-w-4xl p-0 overflow-hidden bg-slate-50 rounded-[2.5rem] border-none">
                    {selectedLead && (
                        <div className="flex flex-col h-[85vh] md:h-auto">
                            {/* Modal Header */}
                            <div className="bg-white p-8 border-b border-slate-100">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div className="flex items-center gap-5">
                                        <div className="w-16 h-16 bg-primary-600 rounded-[1.5rem] flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-primary-200">
                                            {selectedLead.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black text-slate-900 leading-none">{selectedLead.name}</h2>
                                            <p className="text-slate-400 mt-2 flex items-center gap-2 text-sm">
                                                <Clock className="h-4 w-4" />
                                                Получено на {new Date(selectedLead.createdAt).toLocaleString('bg-BG')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <Button
                                            asChild
                                            className="bg-green-600 hover:bg-green-700 text-white rounded-xl h-11 px-6 shadow-lg shadow-green-100"
                                        >
                                            <a href={`tel:${selectedLead.phone}`} className="flex items-center gap-2">
                                                <Phone className="h-4 w-4" />
                                                <span className="font-bold">{selectedLead.phone}</span>
                                            </a>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="rounded-xl h-11 w-11 p-0 border-slate-200 bg-white"
                                            onClick={() => window.open(`https://wa.me/${selectedLead.phone.replace(/\D/g, '')}`, '_blank')}
                                        >
                                            <MessageSquare className="h-5 w-5 text-green-500" />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Body */}
                            <div className="flex-1 overflow-y-auto p-8 grid md:grid-cols-2 gap-8">
                                {/* Column 1: Core Payload */}
                                <div className="space-y-6">
                                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-primary-500" />
                                            Детайли на Потреблението
                                        </h3>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Услуга</label>
                                                <div className="font-bold text-slate-900 capitalize">{selectedLead.serviceType}</div>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Град</label>
                                                <div className="font-bold text-slate-900">{selectedLead.city}</div>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Натоварване</label>
                                                <div className="font-bold text-slate-900 capitalize">{selectedLead.usageIntent}</div>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Срок</label>
                                                <div className="font-bold text-slate-900 capitalize">{selectedLead.timeline}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                            <Shield className="h-4 w-4 text-primary-500" />
                                            Източник и Маркетинг
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                                                <span className="text-xs text-slate-500 font-medium">Форма</span>
                                                <span className="text-xs font-black text-slate-900">{selectedLead.formName || 'N/A'}</span>
                                            </div>
                                            <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                                                <span className="text-xs text-slate-500 font-medium">Кампания</span>
                                                <span className="text-xs font-black text-slate-900">{selectedLead.campaign || 'N/A'}</span>
                                            </div>
                                            <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                                                <span className="text-xs text-slate-500 font-medium">Медия</span>
                                                <span className="text-xs font-bold text-slate-700">{selectedLead.medium || 'N/A'}</span>
                                            </div>
                                            <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                                                <span className="text-xs text-slate-500 font-medium">Referrer</span>
                                                <span className="text-[10px] font-medium text-slate-400 truncate max-w-[200px]" title={selectedLead.referrer || ''}>
                                                    {selectedLead.referrer || 'Direct Entry'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-slate-500 font-medium">IP Адрес</span>
                                                <span className="text-[10px] font-mono font-bold text-slate-400">{selectedLead.ipAddress || 'Unknown'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Column 2: Management & Notes */}
                                <div className="space-y-6">
                                    <div className="bg-slate-900 text-white p-6 rounded-[2rem] shadow-xl">
                                        <h3 className="text-xs font-black uppercase tracking-widest opacity-40 mb-4">Управление на Процеса</h3>
                                        <div className="space-y-6">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase opacity-60">Текущ Статус в Фунията</label>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {PIPELINE_STATUSES.map(s => (
                                                        <button
                                                            key={s.id}
                                                            onClick={() => updateLead(selectedLead.id, { pipelineStatus: s.id })}
                                                            className={cn(
                                                                "py-2 text-[8px] font-black uppercase rounded-lg border transition-all",
                                                                selectedLead.pipelineStatus === s.id
                                                                    ? "bg-white text-slate-900 border-white shadow-lg"
                                                                    : "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700"
                                                            )}
                                                        >
                                                            {s.label.split(' ')[0]}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 pt-2">
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black uppercase opacity-60">Отговорник</label>
                                                    <select
                                                        className="w-full bg-slate-800 border-none rounded-xl text-xs font-bold p-2.5 focus:ring-0"
                                                        value={selectedLead.assignedTo || ''}
                                                        onChange={(e) => updateLead(selectedLead.id, { assignedTo: e.target.value })}
                                                    >
                                                        <option value="">Избери агент</option>
                                                        {AGENTS.map(a => <option key={a} value={a}>{a}</option>)}
                                                    </select>
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black uppercase opacity-60">Следващо Действие</label>
                                                    <select
                                                        className="w-full bg-slate-800 border-none rounded-xl text-xs font-bold p-2.5 focus:ring-0"
                                                        value={selectedLead.nextAction || ''}
                                                        onChange={(e) => updateLead(selectedLead.id, { nextAction: e.target.value })}
                                                    >
                                                        <option value="">Няма</option>
                                                        <option value="call">Обаждане</option>
                                                        <option value="email">Имейл</option>
                                                        <option value="whatsapp">WhatsApp</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex-1 flex flex-col min-h-[250px]">
                                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center justify-between">
                                            <span>Вътрешни Бележки</span>
                                            {isUpdating === selectedLead.id && <RefreshCw className="h-3 w-3 animate-spin" />}
                                        </h3>
                                        <textarea
                                            className="flex-1 w-full bg-slate-50 border-none rounded-2xl p-4 text-sm text-slate-700 focus:ring-2 focus:ring-primary-100 resize-none font-medium"
                                            placeholder="Добавете информация от разговора тук..."
                                            defaultValue={selectedLead.notes || ''}
                                            onBlur={(e) => {
                                                if (e.target.value !== selectedLead.notes) {
                                                    updateLead(selectedLead.id, { notes: e.target.value });
                                                }
                                            }}
                                        />
                                        <div className="mt-3 text-[10px] text-slate-300 font-medium italic">Бележките се запазват автоматично при напускане на полето.</div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="bg-white p-6 border-t border-slate-50 text-center">
                                <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em]">
                                    Lead ID: {selectedLead.id} • Consent v{selectedLead.policyVersion} • {selectedLead.qualityScore >= 2 ? 'High Quality' : 'Standard'}
                                </p>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
