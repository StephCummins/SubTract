import { createTheme } from '@mui/material/styles';

const theme: any = createTheme({
  palette: {
    primary: {
      main: '#05299E',
      light: '#06BEE1',
      dark: '#0D2C54',
      contrastText: '#fff'
    },
    secondary: {
      main: '#FF4F00',
      light: '#FF7409',
      dark: '#D14101',
      contrastText: '#fff'
    }
  },
  typography: {
    fontFamily: 'Poppins, Open Sans, sans-serif',
    h1: {
      fontFamily: 'Bebas Neue, sans-serif',
      fontSize: '3.75rem',
      text: {
        color: 'primary'
      }
    },
    h2: {
      fontFamily: 'Bebas Neue, sans-serif',
      color: 'primary',
      variant: {
        color: 'primary'
      }
    },
    h3: {
      fontFamily: 'Bebas Neue, sans-serif',
      color: 'primary',
      variant: {
        color: 'primary'
      }
    },
    h4: {
      fontFamily: 'Bebas Neue, sans-serif',
      color: 'primary'
    },
    h5: {
      fontFamily: 'Bebas Neue, sans-serif',
      color: 'primary'
    },
    h6: {
      fontFamily: 'Bebas Neue, sans-serif',
      color: 'primary'
    }
  },
  components: {
    MuiButtonBase: {}
  }
});

export default theme;
