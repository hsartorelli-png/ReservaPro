/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'bg-dark-primary': '#0F172A',
                'bg-dark-secondary': '#1E293B',
                'bg-dark-card': '#334155',
                'accent-indigo': '#6366F1',
                'accent-violet': '#8B5CF6',
                'accent-emerald': '#10B981',
                'accent-amber': '#F59E0B',
                'accent-rose': '#EF4444',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
        },
    },
    plugins: [],
}
