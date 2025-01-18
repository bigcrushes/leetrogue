import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button, Box, Typography, TextField, Stack} from '@mui/material';
import { Alert, AlertDescription } from './components/ui/alert';
import { useTheme } from '@mui/material/styles';
import Dialogue from './components/ui/dialogue';
import EmojiObjectsTwoToneIcon from '@mui/icons-material/EmojiObjectsTwoTone';

const CodeEditor = () => {
  const [code, setCode] = useState('def Solution(x):\n\t');
  const [question, setQuestion] = useState(0)
  const [points, setPoints] = useState(0)
  const [ifloop, setIfLoop] = useState(0)
  const [forloop, setForLoop] = useState(0)
  const [imports, setImports] = useState(0)
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [backendStatus, setBackendStatus] = useState('checking');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBox, setSelectedBox] = useState(null); // For tracking the selected box

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
    setDialogOpen(true); // Open the dialog when "Run Code" is clicked

    try {
      console.log('Sending code to backend:', code); // Debug log
      
      const response = await fetch('http://localhost:5000/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, question }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Response from backend:', data); // Debug log
      
      if (data.error) {
        setError("Level failed...");
      } else {
        setOutput("Level Passed!");
      }
    } catch (error) {
      console.error('Error executing code:', error); // Debug log
      setError(`Connection error: ${error.message}. Make sure the Flask backend is running on port 5000.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedBox(null); // Reset selection
  };

  const handleConfirm = () => {
    console.log('User selected box:', selectedBox); // Handle the confirmed selection
    handleDialogClose(); // Close the dialog
  };

  return (
    <Box display="flex" flexDirection="row" width="100vw" height="100vh">
      <Box width="50vw" padding={4} sx={{ gap:5, backgroundColor: theme.palette.primary.main}}>
        <Stack direction="row" spacing={2}>
          <EmojiObjectsTwoToneIcon fontSize='large' sx={{ color:"#FFFFFF" }}/>
          <Typography variant='h3'> Problem Set {question + 1}</Typography>
        </Stack>

        <Typography variant='h5' paddingTop={5}>
          {question === 0 && <span>Write a function that returns True if the parameter is even and False if the parameter is odd.</span>}
          {question === 1 && <span>Write a function that returns True if the number parameter is a palindrome and False if the number parameter is not a palindrome.</span>}  
        </Typography>
      </Box>

      <Box display="flex" flexDirection="column" width="100vw" height="100vh" alignItems="center" padding={10} 
        sx={{ gap:5, backgroundColor: theme.palette.secondary.main }}>
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
          {output }
        </div>

        {/* Use the extracted Dialogue component */}
        <Dialogue
          open={dialogOpen}
          onClose={handleDialogClose}
          onConfirm={handleConfirm}
          selectedBox={selectedBox}
          setSelectedBox={setSelectedBox}
        />
      </Box>
    </Box>
  );
};

export default CodeEditor;