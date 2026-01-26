
import { Suspense } from "react";
import QuizClient from "./quiz-client";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";

export default async function QuizPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
            <QuizClient dict={dict.quiz} lang={lang} />
        </Suspense>
    )
}
