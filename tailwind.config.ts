import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1F3A5F',
          50: '#E8EDF3',
          100: '#D1DBE7',
          200: '#A3B7CF',
          300: '#7593B7',
          400: '#476F9F',
          500: '#1F3A5F',
          600: '#192E4C',
          700: '#132339',
          800: '#0C1726',
          900: '#060C13',
        },
        secondary: {
          DEFAULT: '#4DA3FF',
          50: '#EBF5FF',
          100: '#D6EBFF',
          200: '#ADD6FF',
          300: '#85C2FF',
          400: '#5CADFF',
          500: '#4DA3FF',
          600: '#3E82CC',
          700: '#2E6299',
          800: '#1F4166',
          900: '#0F2133',
        },
        accent: {
          DEFAULT: '#2ECC71',
          50: '#E9F7EF',
          100: '#D4EFDF',
          200: '#A9DFBF',
          300: '#7DCEA0',
          400: '#52BE80',
          500: '#2ECC71',
          600: '#25A35A',
          700: '#1C7A44',
          800: '#12522D',
          900: '#092917',
        },
        background: {
          DEFAULT: '#F7F9FC',
          dark: '#E5E9F0',
        },
        text: {
          DEFAULT: '#2B2B2B',
          light: '#6B7280',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'strong': '0 8px 24px rgba(0, 0, 0, 0.16)',
      },
    },
  },
  plugins: [],
}

export default config
