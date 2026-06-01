import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Background tokens
        background: {
          base: '#F8F9FB', // page background
          primary: '#FFFFFF', // input, cards
          secondary: '#F1F5F9',
          tertiary: '#F8FAFC',
        },

        // Background and surface tokens
        bg: {
          primary: '#FFFFFF',
          secondary: '#F1F5F9',
          tertiary: '#F8FAFC',
        },
        surface: {
          card: '#FFFFFF',
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },

        // Text tokens
        text: {
          primary: '#0F172A',
          secondary: '#6B7280',
          muted: '#6B7280',
        },

        // Accent / Brand — keep `primary` for backward compatibility
        brand: {
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          DEFAULT: '#F97316',
        },
        primary: {
          DEFAULT: '#F97316',
          hover: '#EA580C',
          light: '#FDE8D9',
          dark: '#C2410E',
        },
        accent: {
          DEFAULT: '#F97316',
          hover: '#EA580C',
          light: '#FDE8D9',
          dark: '#C2410E',
        },

        // Border tokens
        border: {
          light: '#E5E7EB',
          medium: '#D1D5DB',
        },

        // Secondary utilities for legacy pages
        secondary: {
          DEFAULT: '#F1F5F9',
          dark: '#334155',
          darker: '#0F172A',
        },

        // Semantic status (kept minimal)
        status: {
          success: '#10B981',
          warning: '#F97316',
          error: '#EF4444',
          info: '#06B6D4',
        },
      },
      spacing: {
        '0': '0px',
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
        '20': '80px',
        '24': '96px',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        'hero': ['56px', { lineHeight: '1.1', letterSpacing: '-0.03em', fontWeight: '800' }],
        'h1': ['48px', { lineHeight: '1.1', letterSpacing: '-0.03em', fontWeight: '800' }],
        'h2': ['40px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h3': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        'h4': ['20px', { lineHeight: '1.4', fontWeight: '600' }],
        'h5': ['16px', { lineHeight: '1.5', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '1.7', fontWeight: '400' }],
        'body': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'caption': ['12px', { lineHeight: '1.5', letterSpacing: '0.08em', fontWeight: '600' }],
        'eyebrow': ['13px', { letterSpacing: '0.15em', fontWeight: '700' }],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.12)',
        'feature': '0 4px 6px rgba(0, 0, 0, 0.05)',
        'button': '0 2px 4px rgba(230, 126, 34, 0.3)',
        'button-hover': '0 4px 12px rgba(230, 126, 34, 0.4)',
        'dropdown': '0 10px 40px rgba(0, 0, 0, 0.15)',
        'modal': '0 20px 60px rgba(0, 0, 0, 0.2)',
        'floating': '0 4px 20px rgba(230, 126, 34, 0.15)',
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        'scale-in': 'scaleIn 0.4s ease',
        'shimmer': 'shimmer 1.5s infinite',
        'spin-slow': 'spin 1s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-secondary) 50%, var(--accent-light) 100%)',
        'cta-gradient': 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)',
        'dark-gradient': 'linear-gradient(180deg, var(--secondary-dark) 0%, var(--secondary-darker) 100%)',
        'card-hover-gradient': 'linear-gradient(135deg, var(--bg-surface) 0%, var(--accent-light) 100%)',
      },
    },
  },
  plugins: [],
};
export default config;