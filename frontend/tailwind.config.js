/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      screens: {
        '3xl': '1840px',
        '4xl': '2160px',
      },
      spacing: {
        '1/2': '50%',
        '1/3': '33.333333%',
        '1/4': '25%',
        '2/3': '66.666667%',
        '3/4': '75%',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: {
          100: '#D6E2FF',
          200: '#809CDE',
          300: '#0033AD',
          400: '#001F68',
          500: '#001445',
        },
        secondary: {
          100: '#FFEFE6',
          200: '#FFC19D',
          300: '#FF640A',
          400: '#993C06',
          500: '#4C1E03',
        },
        destructive: {
          100: '#F1F2F3',
          200: '#C7CDD1',
          300: '#73828C',
          400: '#2E3438',
          500: '#0B0D0E',
        },
        complementary: {
          100: '#E2F2F6',
          200: '#A0D3E0',
          300: '#1C94B2',
          400: '#082C35',
          500: '#030F12',
        },
        general: {
          100: '#FFEFE6',
          200: '#FFC19D',
          300: '#FF640A',
          400: '#993C06',
          500: '#4C1E03',
        },
        extra: {
          200: '#FFC19D',
          300: '#FF640A',
          400: '#993C06',
          500: '#4C1E03',
        },
        bar: '#6685CE',
        bar_back: '#F7F9FF',
        shadow_1: '#2F62DC',
        shadow_2: '#00123D',
        stroke: '#265573',
        menu_select: '#C2EFF2',
        active: '#002379',
        titles: '#242232',
        extra_red: '#FF4D4D',
        extra_yellow: '#FFC14C',
        extra_gray: '#F3F5FF',
        success: '#6FDF8E',
      },
    },
  },
  plugins: [],
};
