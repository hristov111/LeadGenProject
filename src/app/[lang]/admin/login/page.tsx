"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, ShieldAlert } from "lucide-react";

export default function LoginPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = use(params);
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            if (res.ok) {
                // Also set it in session storage for legacy components if needed
                sessionStorage.setItem("admin_pwd", password);
                router.push(`/${lang}/admin`);
                router.refresh();
            } else {
                setError("Невалидна парола");
            }
        } catch (e) {
            setError("Грешка при свързване");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="bg-primary-600 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-200">
                        <ShieldAlert className="text-white h-6 w-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Админ Достъп</h1>
                    <p className="text-slate-500">Системен портал за управление</p>
                </div>

                <Card className="border-slate-200 shadow-xl overflow-hidden">
                    <CardHeader className="bg-white border-b border-slate-50 pb-6">
                        <CardTitle className="text-lg">Влезте в акаунта си</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-8">
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Парола</label>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Въведете вашата парола"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pr-10 h-11 border-slate-200 focus:ring-primary-500"
                                        autoFocus
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 flex items-center gap-2">
                                    <div className="w-1 h-1 bg-red-600 rounded-full" />
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full h-11 bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-all shadow-md active:scale-[0.98]"
                                disabled={isLoading}
                            >
                                {isLoading ? "Проверка..." : "Вход в системата"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <p className="text-center mt-8 text-sm text-slate-400">
                    &copy; {new Date().getFullYear()} TelecomBGLabs. Protected Environment.
                </p>
            </div>
        </div>
    );
}
