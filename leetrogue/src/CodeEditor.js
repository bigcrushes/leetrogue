import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button, Box, Typography, TextField} from '@mui/material';
import { Alert, AlertDescription } from './components/ui/alert';
import { useTheme } from '@mui/material/styles';

const CodeEditor = () => {
  const [code, setCode] = useState('print("Hello, World!")');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [backendStatus, setBackendStatus] = useState('checking');

  const theme = useTheme()

  // Check if backend is running when component mounts
  useEffect(() => {
    checkBackendStatus();
  }, []);

  const checkBackendStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/test');
      const data = await response.json();
      setBackendStatus('connected');
      console.log('Backend status:', data.message);
    } catch (error) {
      setBackendStatus('disconnected');
      console.error('Backend connection failed:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 4;
      }, 0);
    }
  };

  const executeCode = async () => {
    setIsLoading(true);
    setError('');
    setOutput('');

    try {
      console.log('Sending code to backend:', code); // Debug log
      
      const response = await fetch('http://localhost:5000/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Response from backend:', data); // Debug log
      
      if (data.error) {
        setError(data.error);
      } else {
        setOutput(data.output || 'Code executed successfully with no output');
      }
    } catch (error) {
      console.error('Error executing code:', error); // Debug log
      setError(`Connection error: ${error.message}. Make sure the Flask backend is running on port 5000.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box display="flex" flexDirection="row" width="100vw" height="100vh">
      <Box width="50vw" padding={4} sx={{backgroundColor: theme.palette.primary.main}}>
        <Typography variant='h3'> Problem Set 1</Typography>
      </Box>

      <Box display="flex" flexDirection="column" width="100vw" height="100vh" alignItems="center" padding={10} sx={{ gap:5 }}>
        <Typography variant="h3">Enter code here</Typography>
          
        <TextField
          fullWidth
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter your Python code here..."
          multiline
          rows={10} // Initial visible rows
          sx={{
            height: 300, // Fixed height for the TextField
            '& .MuiOutlinedInput-root': {
              height: '100%', // Make the container match the full height
              alignItems: 'start', // Align text to the top
              overflow: 'auto', // Add overflow for scrolling
            },
            '& .MuiOutlinedInput-input': {
              resize: 'none', // Disable manual resizing (optional)
            },
          }}
          InputProps={{
            style: {
              height: '100%',
              overflow: 'auto', // Ensure scrolling for the content
            },
          }}
        />


        <Button
          onClick={executeCode}
          disabled={isLoading || backendStatus !== 'connected'}
        >
          {isLoading ? 'Running...' : 'Run Code'}
        </Button>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
            
        <div className="bg-gray-900 text-white p-4 rounded-lg font-mono whitespace-pre-wrap">
          {output || 'Output will appear here...'}
        </div>
      </Box>
    </Box>
  );
};

export default CodeEditor;