import './App.css';
import CodeEditor from './CodeEditor';
import { theme } from './components/ui/theme';
import { ThemeProvider } from '@mui/material/styles';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CodeEditor/>
    </ThemeProvider>
  );
}


export default App;
