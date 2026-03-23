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
        bg: '#0A0A0A',
        'bg-card': '#141414',
        'bg-card-hover': '#1A1A1A',
        border: '#222222',
        'border-hover': '#444444',
        text: '#E8E8E8',
        'text-mid': '#999999',
        'text-dim': '#555555',
        accent: '#C8FF00',
        'accent-dim': 'rgba(200, 255, 0, 0.08)',
        sale: '#FF4444',
      },
      fontFamily: {
        body: ['var(--font-body)', 'DM Sans', 'sans-serif'],
        headline: ['var(--font-headline)', 'Darker Grotesque', 'sans-serif'],
        'headline-alt': ['var(--font-headline-alt)', 'Epilogue', 'sans-serif'],
        mono: ['var(--font-mono)', 'Azeret Mono', 'monospace'],
      },
      maxWidth: {
        content: '1200px',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'ticker': 'scroll 30s linear infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scroll: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
