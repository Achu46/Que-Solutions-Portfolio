/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        elevated: 'var(--elevated)',
        border: 'var(--border)',
        text: 'var(--text)',
        accent: 'var(--accent)',
        'accent-contrast': 'var(--accent-contrast)',
        // Official Olive Brand Scale + Lime Glow Highlight
        brand: {
          DEFAULT: 'var(--brand)',
          text: 'var(--brand-text)',
          50: '#f6f8f4',
          100: '#ebf1e6',
          200: '#d7e3cd',
          300: '#b8cea8',
          400: '#94b380',
          500: '#6c8c54',
          600: '#54703f', // Official primary logo green
          700: '#425832', // Deep olive
          800: '#36462a',
          900: '#2d3a24',
          950: '#161f11',
          lime: '#b8e08a', // Brighter olive-lime ONLY for glows/highlights
        },
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Poppins', 'system-ui', 'monospace'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(84, 112, 63, 0.08)',
        'soft-lg': '0 10px 30px -4px rgba(84, 112, 63, 0.12)',
        'glow': '0 4px 20px -2px rgba(84, 112, 63, 0.3)',
        'lime-glow': '0 0 24px -2px rgba(184, 224, 138, 0.45)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
