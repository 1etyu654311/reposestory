/**
 * Calculate estimated reading time for a text
 * Accounts for different reading speeds by language
 */
export function getReadingTime(text: string, lang: string = 'en'): number {
    const wordsPerMinute: Record<string, number> = {
        ar: 180, // Arabic typically slower due to diacritics
        en: 220,
        es: 200,
        fr: 200,
    };

    const wpm = wordsPerMinute[lang] || 220;
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wpm);

    return Math.max(1, minutes);
}

/**
 * Format reading time with locale-aware text
 */
export function formatReadingTime(minutes: number, lang: string): string {
    const labels: Record<string, string> = {
        ar: `${minutes} دقائق قراءة`,
        en: `${minutes} min read`,
        es: `${minutes} min de lectura`,
        fr: `${minutes} min de lecture`,
    };

    return labels[lang] || labels['en'];
}
