/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#082f49',
        },
        abyss: {
          800: '#0a1128',
          900: '#001233',
          950: '#000814',
          pitch: '#020617'
        },
        bioglow: {
          cyan: '#00f0ff',
          teal: '#00ffd5',
          neon: '#38ef7d',
          violet: '#a855f7',
          gold: '#fbbf24'
        }
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'bounce-gentle': 'bounceGentle 3s ease-in-out infinite',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'sonar-ping': 'sonarPing 3s cubic-bezier(0, 0, 0.2, 1) infinite',
        'spin-slow': 'spin 18s linear infinite',
      },
      keyframes: {
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        floatSlow: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(6px, -14px)' }
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.05)' }
        },
        sonarPing: {
          '75%, 100%': { transform: 'scale(2.4)', opacity: '0' }
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
