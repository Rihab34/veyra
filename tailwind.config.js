/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        veyra: {
          50: '#fff4ee',
          100: '#ffe6d9',
          200: '#ffcbb0',
          300: '#ffab80',
          400: '#ff8650',
          500: '#ff6a2b',
          600: '#e8561a',
          700: '#c4501c',
          800: '#9a3f16',
          900: '#6e2d10',
        },
        charcoal: {
          700: '#5e6670',
          800: '#2a3038',
          900: '#0e1217',
        },
        warm: {
          50: '#fbf6ee',
          100: '#f5eee2',
          200: '#e9dfcf',
          300: '#d9ccb6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(14,18,23,0.04), 0 12px 32px -20px rgba(14,18,23,0.22)',
        cardHover: '0 2px 4px rgba(14,18,23,0.05), 0 24px 48px -24px rgba(14,18,23,0.3)',
        glow: '0 0 0 4px rgba(249,115,22,0.15)',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-soft': 'pulseSoft 1.6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
};
