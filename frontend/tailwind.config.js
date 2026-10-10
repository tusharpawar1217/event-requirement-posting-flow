/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        starlit: '#D4AA98',
        moonstone: '#77708D',
        nebula: '#4E5D68',
        midnight: '#2B313A',
        cosmic: '#0F1115',
        primary: {
          50: '#f5f3f1',
          100: '#ebe6e1',
          200: '#D4AA98',
          300: '#c99d86',
          400: '#be9074',
          500: '#b38362',
          600: '#906950',
          700: '#6c4f3c',
          800: '#483428',
          900: '#241a14',
        },
        secondary: {
          50: '#f0f0f2',
          100: '#e1e0e5',
          200: '#c3c1cb',
          300: '#a5a2b1',
          400: '#878397',
          500: '#77708D',
          600: '#5f5a71',
          700: '#474355',
          800: '#2f2d38',
          900: '#18161c',
        },
        dark: {
          50: '#e9eaeb',
          100: '#d3d5d7',
          200: '#a7abaf',
          300: '#7b8187',
          400: '#4E5D68',
          500: '#3e4a54',
          600: '#2B313A',
          700: '#20252c',
          800: '#16191d',
          900: '#0F1115',
        }
      },
      backgroundImage: {
        'cosmic-gradient': 'linear-gradient(135deg, #0F1115 0%, #2B313A 50%, #4E5D68 100%)',
        'starlit-gradient': 'linear-gradient(135deg, #77708D 0%, #D4AA98 100%)',
        'midnight-glow': 'radial-gradient(ellipse at top, #2B313A, #0F1115)',
      }
    },
  },
  plugins: [],
};
