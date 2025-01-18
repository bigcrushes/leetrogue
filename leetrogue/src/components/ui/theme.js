import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    typography: {
        fontFamily: 'Inter, sans-serif',
        allVariants: {
          color: '#FFFFFF', // default
        },
    },
    palette: {
      primary: {
        main: '#070E4A',
      },
      secondary: {
        main: '#FF6666'
      },
      text: {  // Add this to control text colors
        primary: '#FFFFFF',
        secondary: '#757575'
      }
    },
});