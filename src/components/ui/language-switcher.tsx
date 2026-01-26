'use client';

import { usePathname, useRouter } from 'next/navigation';
import { i18n, type Locale } from '@/i18n-config';
import { Button } from './button';
import { Globe } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function LanguageSwitcher() {
    const pathName = usePathname();
    const router = useRouter();

    // Helper to get current locale from path
    const currentLocale = i18n.locales.find((locale) =>
        pathName.startsWith(`/${locale}`)
    ) || i18n.defaultLocale;

    const redirectedPathName = (locale: string) => {
        if (!pathName) return '/';
        const segments = pathName.split('/');
        segments[1] = locale;
        return segments.join('/');
    };

    const handleLocaleChange = (newLocale: Locale) => {
        // set cookie for persistence
        document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;

        // redirect
        router.push(redirectedPathName(newLocale));
    };

    const languageNames: Record<Locale, string> = {
        en: 'English',
        bg: 'Български',
        de: 'Deutsch',
        ru: 'Русский',
        tr: 'Türkçe',
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-9 px-0">
                    <Globe className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                    <span className="sr-only">Toggle language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {i18n.locales.map((locale) => (
                    <DropdownMenuItem key={locale} onClick={() => handleLocaleChange(locale)}>
                        {languageNames[locale]}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
