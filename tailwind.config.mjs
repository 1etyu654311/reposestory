/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f0f4ff',
                    100: '#dbe4ff',
                    200: '#bac8ff',
                    300: '#91a7ff',
                    400: '#748ffc',
                    500: '#5c7cfa',
                    600: '#4c6ef5',
                    700: '#4263eb',
                    800: '#3b5bdb',
                    900: '#364fc7',
                    950: '#2b3ea0',
                },
                surface: {
                    50: '#f8f9fa',
                    100: '#f1f3f5',
                    200: '#e9ecef',
                    300: '#dee2e6',
                    400: '#ced4da',
                    500: '#adb5bd',
                    600: '#868e96',
                    700: '#495057',
                    800: '#343a40',
                    900: '#212529',
                    950: '#0d1117',
                },
            },
            fontFamily: {
                arabic: ['Cairo', 'Tajawal', 'system-ui', 'sans-serif'],
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
            },
            typography: (theme) => ({
                DEFAULT: {
                    css: {
                        '--tw-prose-body': theme('colors.surface.700'),
                        '--tw-prose-headings': theme('colors.surface.900'),
                        '--tw-prose-links': theme('colors.primary.600'),
                        '--tw-prose-code': theme('colors.primary.700'),
                        maxWidth: '75ch',
                    },
                },
                dark: {
                    css: {
                        '--tw-prose-body': theme('colors.surface.300'),
                        '--tw-prose-headings': theme('colors.surface.50'),
                        '--tw-prose-links': theme('colors.primary.400'),
                        '--tw-prose-code': theme('colors.primary.300'),
                        '--tw-prose-bold': theme('colors.surface.100'),
                        '--tw-prose-counters': theme('colors.surface.400'),
                        '--tw-prose-bullets': theme('colors.surface.400'),
                        '--tw-prose-hr': theme('colors.surface.700'),
                        '--tw-prose-quotes': theme('colors.surface.200'),
                        '--tw-prose-quote-borders': theme('colors.primary.500'),
                        '--tw-prose-captions': theme('colors.surface.400'),
                        '--tw-prose-th-borders': theme('colors.surface.600'),
                        '--tw-prose-td-borders': theme('colors.surface.700'),
                    },
                },
                rtl: {
                    css: {
                        textAlign: 'right',
                        direction: 'rtl',
                    },
                },
            }),
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'slide-in-right': 'slideInRight 0.3s ease-out',
                'scale-in': 'scaleIn 0.3s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideInRight: {
                    '0%': { opacity: '0', transform: 'translateX(20px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
};
