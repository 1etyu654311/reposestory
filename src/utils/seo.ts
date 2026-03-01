import type { Locale } from '@i18n/utils';

interface SeoProps {
    title: string;
    description: string;
    image?: string;
    url: string;
    locale: Locale;
    type?: 'website' | 'article';
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    tags?: string[];
}

/**
 * Generate Open Graph meta tags
 */
export function getOpenGraphTags(props: SeoProps) {
    const tags: Record<string, string> = {
        'og:title': props.title,
        'og:description': props.description,
        'og:url': props.url,
        'og:type': props.type || 'website',
        'og:locale': getOgLocale(props.locale),
        'og:site_name': 'Learn New Idea',
    };

    if (props.image) {
        tags['og:image'] = props.image;
    }

    if (props.type === 'article') {
        if (props.publishedTime) tags['article:published_time'] = props.publishedTime;
        if (props.modifiedTime) tags['article:modified_time'] = props.modifiedTime;
        if (props.author) tags['article:author'] = props.author;
        if (props.tags) {
            props.tags.forEach((tag, i) => {
                tags[`article:tag:${i}`] = tag;
            });
        }
    }

    return tags;
}

/**
 * Generate Twitter Card meta tags
 */
export function getTwitterTags(props: SeoProps) {
    return {
        'twitter:card': 'summary_large_image',
        'twitter:title': props.title,
        'twitter:description': props.description,
        ...(props.image ? { 'twitter:image': props.image } : {}),
    };
}

/**
 * Generate Article structured data (JSON-LD)
 */
export function getArticleJsonLd(props: {
    title: string;
    description: string;
    url: string;
    image?: string;
    datePublished: string;
    dateModified?: string;
    author?: string;
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: props.title,
        description: props.description,
        url: props.url,
        ...(props.image ? { image: props.image } : {}),
        datePublished: props.datePublished,
        ...(props.dateModified ? { dateModified: props.dateModified } : {}),
        author: {
            '@type': 'Person',
            name: props.author || 'Learn New Idea',
        },
        publisher: {
            '@type': 'Organization',
            name: 'Learn New Idea',
        },
    };
}

function getOgLocale(locale: Locale): string {
    const map: Record<Locale, string> = {
        ar: 'ar_SA',
        en: 'en_US',
        es: 'es_ES',
        fr: 'fr_FR',
    };
    return map[locale];
}

/**
 * Format date with locale
 */
export function formatDate(date: Date, locale: Locale): string {
    return date.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}
