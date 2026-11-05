/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF4ED',
          100: '#FFE5D5',
          200: '#FFC8A9',
          300: '#FFA174',
          400: '#FF713B',
          500: '#F4511E',
          600: '#E64212',
          700: '#BF320D',
          800: '#982A13',
          900: '#7B2716',
        },
        secondary: {
          50: '#F7F7F7',
          100: '#EEEEEE',
          200: '#DCDCDC',
          300: '#BDBDBD',
          400: '#929292',
          500: '#666666',
          600: '#484848',
          700: '#333333',
          800: '#202020',
          900: '#111111',
          950: '#080808',
        },
        risk: {
          critical: '#DC2626',
          high: '#EA580C',
          medium: '#D97706',
          low: '#16A34A',
          neutral: '#64748B',
        },
        semantic: {
          success: '#16A34A',
          successSurface: '#F0FDF4',
          warning: '#D97706',
          warningSurface: '#FFFBEB',
          danger: '#DC2626',
          dangerSurface: '#FEF2F2',
          info: '#2563EB',
          infoSurface: '#EFF6FF',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        'sm': '4px',
        DEFAULT: '8px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
      },
      boxShadow: {
        'subtle': '0 1px 2px rgba(0,0,0,0.05)',
        'card': '0 2px 8px rgba(0,0,0,0.06)',
        'popover': '0 10px 24px rgba(0,0,0,0.1)',
        'dark-subtle': '0 1px 2px rgba(0,0,0,0.3)',
        'dark-card': '0 2px 12px rgba(0,0,0,0.35)',
        'dark-popover': '0 10px 30px rgba(0,0,0,0.5)',
        'glow-orange': '0 0 25px rgba(244, 81, 30, 0.25)',
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(ellipse at 50% 20%, #F7C9B9 0%, #F28A62 25%, #D94B1F 55%, #3C1B13 80%, #080808 100%)',
        'hero-gradient-dark': 'radial-gradient(ellipse at 50% 30%, #5a2012 0%, #30100a 45%, #140704 75%, #080808 100%)',
      }
    },
  },
  plugins: [],
}
