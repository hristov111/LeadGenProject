import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import ResultsClient from "./results-client";

export default async function ResultsPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return <ResultsClient dict={dict} lang={lang} />;
}
