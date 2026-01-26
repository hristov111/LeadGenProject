import 'server-only';
import type { Locale } from './i18n-config';

// We enumerate all dictionaries here for better type safety and static analysis
const dictionaries = {
    en: () => import('./dictionaries/en.json').then((module) => module.default),
    bg: () => import('./dictionaries/bg.json').then((module) => module.default),
    de: () => import('./dictionaries/de.json').then((module) => module.default),
    ru: () => import('./dictionaries/ru.json').then((module) => module.default),
    tr: () => import('./dictionaries/tr.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => {
    // efficient check to avoid try-catch if possible, 
    // or just default to 'en' if key missing
    if (locale in dictionaries) {
        return dictionaries[locale]();
    }
    return dictionaries['en']();
};
