
import ThankYouClient from "./thank-you-client";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";

export default async function ThankYouPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return (
        <ThankYouClient dict={dict.thankYou} lang={lang} />
    )
}
