// Supported locales
export const locales = ['ar', 'en', 'es', 'fr'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'ar';

// RTL languages
export const rtlLocales: Locale[] = ['ar'];

// Language display info
export const languageInfo: Record<Locale, { name: string; nativeName: string; flag: string; dir: 'rtl' | 'ltr' }> = {
    ar: { name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', dir: 'rtl' },
    en: { name: 'English', nativeName: 'English', flag: '🇬🇧', dir: 'ltr' },
    es: { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', dir: 'ltr' },
    fr: { name: 'French', nativeName: 'Français', flag: '🇫🇷', dir: 'ltr' },
};

/**
 * Extract locale from URL path
 */
export function getLangFromUrl(url: URL): Locale {
    const segments = url.pathname.split('/').filter(Boolean);
    const firstSegment = segments[0] as Locale;
    if (locales.includes(firstSegment)) {
        return firstSegment;
    }
    return defaultLocale;
}

/**
 * Get direction (rtl or ltr) for a locale
 */
export function getDirection(locale: Locale): 'rtl' | 'ltr' {
    return languageInfo[locale].dir;
}

/**
 * Get font family class for a locale
 */
export function getFontClass(locale: Locale): string {
    return rtlLocales.includes(locale) ? 'font-arabic' : 'font-sans';
}

/**
 * Build a localized URL path
 */
export function getLocalizedUrl(path: string, locale: Locale): string {
    // Remove any existing locale prefix
    const cleanPath = path.replace(/^\/(ar|en|es|fr)/, '');
    return `/${locale}${cleanPath || '/'}`;
}

/**
 * Get the slug from a localized URL
 */
export function getSlugFromPath(path: string): string {
    return path.replace(/^\/(ar|en|es|fr)\/blog\//, '').replace(/\/$/, '');
}

// Import translations
import arTranslations from './translations/ar.json';
import enTranslations from './translations/en.json';
import esTranslations from './translations/es.json';
import frTranslations from './translations/fr.json';

type TranslationKeys = keyof typeof enTranslations;

const translations: Record<Locale, Record<string, string>> = {
    ar: arTranslations,
    en: enTranslations,
    es: esTranslations,
    fr: frTranslations,
};

/**
 * Get a translation string for a given locale and key
 */
export function t(locale: Locale, key: string): string {
    return translations[locale]?.[key] || translations[defaultLocale]?.[key] || key;
}

/**
 * Get all translations for a locale
 */
export function getTranslations(locale: Locale): Record<string, string> {
    return translations[locale] || translations[defaultLocale];
}
