import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Custom palette
        'almond': '#EFD0CA',
        'almond-light': '#F5DED1',
        'almond-dark': '#E8BFB2',
        'pale-oak': '#C1BCAC',
        'pale-oak-light': '#D0C9B8',
        'pale-oak-dark': '#B2ADA0',
        'grey-olive': '#979B8D',
        'grey-olive-light': '#A6AAA0',
        'grey-olive-dark': '#88897B',
        'dusty-olive': '#5C7457',
        'dusty-olive-light': '#6B8565',
        'dusty-olive-dark': '#4D6348',
        'dark-spruce': '#214E34',
        'dark-spruce-light': '#2F6848',
        'dark-spruce-dark': '#1A3D29',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      borderRadius: {
        'xl': '20px',
        '2xl': '32px',
        '3xl': '48px',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.1)',
        'glass-lg': '0 25px 50px rgba(0, 0, 0, 0.15)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'float-slow': 'float 4s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};

export default config;
