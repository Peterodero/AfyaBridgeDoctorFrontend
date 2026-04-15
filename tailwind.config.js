/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // ── Brand primaries ────────────────────────────────
        primary: {
          DEFAULT: '#137FEC',
          light:   '#13B6EC',
          50:  'rgba(19,127,236,0.05)',
          100: 'rgba(19,127,236,0.10)',
          200: 'rgba(19,127,236,0.20)',
        },
        // ── Teal (telemedicine, completed) ─────────────────
        teal: {
          DEFAULT: '#0D9488',
          50:  '#F0FDFA',
          100: '#CCFBF1',
          700: '#0F766E',
          800: '#115E59',
        },
        // ── Semantic ───────────────────────────────────────
        success: {
          DEFAULT: '#22C55E',
          50:  '#DCFCE7',
          600: '#16A34A',
          700: '#15803D',
        },
        warning: {
          DEFAULT: '#F97316',
          50:  '#FFEDD5',
          700: '#C2410C',
          800: '#D97706',
        },
        danger: {
          DEFAULT: '#EF4444',
          50:  '#FEF2F2',
          100: '#FEE2E2',
          600: '#DC2626',
          700: '#B91C1C',
        },
        // ── Blue scale (status badges) ─────────────────────
        blue: {
          50:  '#EFF6FF',
          100: '#DBEAFE',
          700: '#1D4ED8',
        },
        // ── Neutrals — slate scale with Figma exact values ─
        slate: {
          50:  '#F8FAFC',
          100: '#F1F5F9',
          150: '#E2E8F0',  // extra stop for borders
          200: '#CBD5E1',
          300: '#94A3B8',
          400: '#64748B',
          500: '#475569',
          600: '#334155',
          700: '#1E293B',
          800: '#0D141B',  // video workspace bg
          900: '#0F172A',
        },
        // ── Page background ────────────────────────────────
        page: '#F6F7F8',
      },
      boxShadow: {
        xs:    '0px 1px 2px rgba(0,0,0,0.05)',
        sm:    '0px 4px 6px -1px rgba(0,0,0,0.1)',
        md:    '0px 10px 15px -3px rgba(0,0,0,0.1)',
        lg:    '0px 20px 25px -5px rgba(0,0,0,0.1)',
        xl:    '0px 25px 50px -12px rgba(0,0,0,0.25)',
        blue:  '0px 10px 15px -3px rgba(19,127,236,0.2)',
        teal:  '0px 4px 6px -1px rgba(13,148,136,0.2)',
        green: '0px 4px 6px -1px rgba(16,185,129,0.3)',
        hero:  '0px 20px 25px -5px rgba(0,0,0,0.15)',
      },
      borderRadius: {
        sm:  '4px',
        md:  '8px',
        lg:  '12px',
        xl:  '16px',
        '2xl': '20px',
      },
    },
  },
  plugins: [],
}
