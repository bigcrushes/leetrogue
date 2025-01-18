import { AppBar, Typography } from '@mui/material';
import './App.css';
import CodeEditor from './CodeEditor';
import { theme } from './components/ui/theme';
import { ThemeProvider } from '@mui/material/styles';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" sx={{ backgroundColor:"#330066", height:70}}>
        <Typography> namit deb</Typography>
      </AppBar>
      <CodeEditor/>
    </ThemeProvider>
  );
}

export default App;
