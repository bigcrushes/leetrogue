import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    typography: {
        fontFamily: 'Inter, sans-serif',
        h1: { color: '#000000' },
        h2: { color: '#000000' },
        h3: { color: '#000000' },
        h4: { color: '#000000' },
        h5: { color: '#000000' },
        h6: { color: '#000000' },
        allVariants: {
          color: '#3a3838', // default
        },
    },
    palette: {
      primary: {
        main: '#65366a',
      },
      secondary: {
        main: '#9c84a1'
      }
    },
});