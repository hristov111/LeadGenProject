
import { Suspense } from "react";
import LeadClient from "./lead-client";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";

export default async function LeadPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return (
        <Suspense fallback={<div>Loading form...</div>}>
            <LeadClient dict={dict.lead} lang={lang} />
        </Suspense>
    )
}
