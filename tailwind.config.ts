import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        primary: {
          50: 'hsl(180, 70%, 95%)',
          100: 'hsl(180, 70%, 90%)',
          200: 'hsl(180, 70%, 80%)',
          300: 'hsl(180, 70%, 70%)',
          400: 'hsl(180, 70%, 60%)',
          500: 'hsl(180, 70%, 50%)',
          600: 'hsl(180, 70%, 40%)',
          700: 'hsl(180, 70%, 30%)',
          800: 'hsl(180, 70%, 20%)',
          900: 'hsl(180, 70%, 10%)',
        },
      },
    },
  },
  plugins: [],
}
export default config
