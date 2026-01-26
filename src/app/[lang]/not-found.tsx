import { PageContainer } from "@/components/ui/page-container";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Compass } from "lucide-react";

export default async function NotFoundPage({
    params,
}: {
    params: Promise<{ lang: string }> | any;
}) {
    const resolvedParams = await params;
    const lang = resolvedParams?.lang || "bg";
    const dict = (await getDictionary(lang as Locale)) as any;

    return (
        <PageContainer className="py-32 flex flex-col items-center text-center">
            <div className="p-6 rounded-full bg-slate-100 text-slate-400 mb-8">
                <Compass className="h-16 w-16" />
            </div>
            <h1 className="text-5xl font-black text-slate-900 mb-4">404</h1>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">{dict.notfound.title}</h2>
            <p className="text-slate-500 mb-10 max-w-md">
                {dict.notfound.message}
            </p>
            <Button asChild size="lg" className="px-8 bg-primary-600 hover:bg-primary-700">
                <Link href={`/${lang}`}>
                    <Home className="mr-2 h-5 w-5" />
                    {dict.notfound.back}
                </Link>
            </Button>
        </PageContainer>
    );
}
