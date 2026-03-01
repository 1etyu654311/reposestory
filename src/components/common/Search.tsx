import { useEffect, useState, useRef } from 'react';

interface SearchProps {
    lang: string;
    placeholder: string;
}

export default function Search({ lang, placeholder }: SearchProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Listen for custom event to open search from Header
        const openSearch = () => setIsOpen(true);
        window.addEventListener('open-search', openSearch);

        // ESC to close
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        window.addEventListener('keydown', handleEsc);

        return () => {
            window.removeEventListener('open-search', openSearch);
            window.removeEventListener('keydown', handleEsc);
        };
    }, []);

    useEffect(() => {
        if (isOpen && containerRef.current) {
            // Initialize Pagefind UI when dialog opens
            const initPagefind = async () => {
                try {
                    // @ts-ignore
                    if (window.PagefindUI) {
                        // @ts-ignore
                        new window.PagefindUI({
                            element: "#pagefind-search",
                            showSubResults: true,
                            showImages: true,
                            translations: {
                                placeholder: placeholder,
                            },
                            bundlePath: "/_pagefind/" // Default path for Pagefind
                        });
                    }
                } catch (e) {
                    console.error("Pagefind not found. It will work after a production build.", e);
                }
            };

            initPagefind();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:pt-32">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-surface-950/40 backdrop-blur-sm animate-fade-in"
                onClick={() => setIsOpen(false)}
            />

            {/* Dialog */}
            <div className="relative w-full max-w-2xl bg-white dark:bg-surface-900 rounded-2xl shadow-2xl border border-surface-200 dark:border-surface-700 overflow-hidden animate-scale-in">
                <div className="p-4 border-b border-surface-100 dark:border-surface-800 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-surface-900 dark:text-surface-100 uppercase tracking-tight">
                        Search
                    </h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-500 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                    </button>
                </div>

                <div id="pagefind-search" className="p-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {!window.hasOwnProperty('PagefindUI') && (
                        <div className="text-center py-10 text-surface-500">
                            <p>Search indexing occurs during build.</p>
                            <p className="text-sm">Run 'npm run build' to see search in action.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
