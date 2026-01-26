import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: {
                    50: '#F0F7FF',
                    100: '#E0F0FE',
                    200: '#BAE6FD',
                    300: '#7DD3FC',
                    400: '#38BDF8',
                    500: '#0EA5E9',
                    600: '#0284C7',
                    700: '#0369A1',
                    800: '#075985',
                    900: '#0C4A6E',
                    950: '#082F49',
                },
                secondary: {
                    400: '#2DD4BF',
                    500: '#14B8A6',
                },
                accent: {
                    400: '#FBBF24',
                    500: '#F59E0B',
                    600: '#D97706',
                },
            },
            fontFamily: {
                sans: ['var(--font-geist-sans)', 'sans-serif'],
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
            animation: {
                fadeIn: 'fadeIn 0.5s ease-out forwards',
                slideUp: 'slideUp 0.5s ease-out forwards',
            },
        },
    },
    plugins: [],
};
export default config;
