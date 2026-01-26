export const i18n = {
    defaultLocale: 'en',
    locales: ['en', 'bg', 'de', 'ru', 'tr'],
} as const;

export type Locale = (typeof i18n)['locales'][number];
