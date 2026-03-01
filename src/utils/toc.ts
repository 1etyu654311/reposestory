export interface TocItem {
    depth: number;
    text: string;
    slug: string;
}

/**
 * Generate table of contents from markdown headings
 */
export function generateToc(headings: { depth: number; slug: string; text: string }[]): TocItem[] {
    return headings
        .filter((h) => h.depth >= 2 && h.depth <= 4)
        .map((h) => ({
            depth: h.depth,
            text: h.text,
            slug: h.slug,
        }));
}
