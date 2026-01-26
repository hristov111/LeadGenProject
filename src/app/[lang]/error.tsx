"use client";

import { useEffect } from "react";
import { PageContainer } from "@/components/ui/page-container";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function ErrorPage({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <PageContainer className="py-32 flex flex-col items-center text-center">
            <div className="p-6 rounded-full bg-red-50 text-red-500 mb-8">
                <AlertCircle className="h-16 w-16" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Нещо се обърка</h1>
            <p className="text-slate-500 mb-10 max-w-md">
                Възникна неочаквана грешка. Моля, опитайте да презаредите страницата или се върнете в началото.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={() => reset()} size="lg" variant="outline" className="px-8 border-slate-200">
                    <RefreshCw className="mr-2 h-5 w-5" />
                    Опитай пак
                </Button>
                <Button asChild size="lg" className="px-8 bg-slate-900 hover:bg-slate-800">
                    <Link href="/">
                        <Home className="mr-2 h-5 w-5" />
                        Начало
                    </Link>
                </Button>
            </div>
        </PageContainer>
    );
}
