import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        lcars: {
          amber: '#22D3EE',
          orange: '#0EA5E9',
          peach: '#BAE6FD',
          blue: '#6366F1',
          lavender: '#8B5CF6',
          pink: '#EC4899',
          red: '#DC2626',
          'light-blue': '#94A3B8',
          tan: '#38BDF8',
          bg: '#0F172A',
          panel: '#1E293B',
          text: '#22D3EE',
          'text-light': '#E2E8F0',
        },
      },
      fontFamily: {
        mono: ['Share Tech Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'lcars': '2rem',
        'lcars-sm': '1rem',
        'lcars-lg': '3rem',
      },
      animation: {
        'lcars-pulse': 'lcars-pulse 2s ease-in-out infinite',
        'lcars-scan': 'lcars-scan 1.5s ease-in-out infinite',
        'lcars-flicker': 'lcars-flicker 0.15s ease-in-out',
        'slide-in-left': 'slide-in-left 0.3s ease-out',
        'slide-in-up': 'slide-in-up 0.3s ease-out',
      },
      keyframes: {
        'lcars-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        'lcars-scan': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'lcars-flicker': {
          '0%': { opacity: '1' },
          '25%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
          '75%': { opacity: '0.3' },
          '100%': { opacity: '1' },
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-in-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
