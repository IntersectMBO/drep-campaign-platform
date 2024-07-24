'use client';
import { Poppins, Roboto } from 'next/font/google';
import { createTheme } from '@mui/material/styles';

const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  subsets: ['devanagari'],
});

export type Theme = typeof theme;

const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 50,
          textTransform: 'none',
          backgroundColor: '#0033AD',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'black',
          color: 'white',
          padding: '8px',
        },
        arrow: {
          color: 'black',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          border: 'none',
          '&:hover:not($disabled):before': {
            borderBottom: 'none',
          },
          '&:after': {
            borderBottom: 'none',
          },
        },
        root: {
          border: 'none',
          borderRadius: '50px',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          border: 'none',
          borderRadius: '50px',
        },
      },
    },
  },
  typography: {
    fontFamily: poppins.style.fontFamily,
  },
});

export default theme;
