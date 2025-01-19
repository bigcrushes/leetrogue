import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { AppBar, Button, Box, Typography, TextField, Stack} from '@mui/material';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
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
        body: JSON.stringify({ code, question, ifloop, forloop, imports }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Response from backend:', data); // Debug log
      
      if (data.error) {
        setError("Level failed...");
      } else {

        setOutput(data.output);
        if(data.output == "Level passed!"){
            setDialogOpen(true); // Open dialogue only on level success
            setPoints((points) => points + 40 + question * 10); // e.g
        }
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
    setCode((code) => question < 3 ? 'def Solution(x):\n\t' : 'def Solution(times, n, k):\n\t')
    setQuestion((question) => question + 1);
  };


  const handleConfirm = ({ selectionCounts, remainingPoints }) => {
    // Update individual states based on selectionCounts
    setIfLoop((prev) => prev + selectionCounts.ifLoop);
    setForLoop((prev) => prev + selectionCounts.forLoop);
    setImports((prev) => prev + selectionCounts.imports);
  
    // Update points
    setPoints(remainingPoints);
    setOutput('');
  
    // Close the dialog
    handleDialogClose();
  };
  

  return (
    <div>
    <AppBar position="static" sx={{ backgroundColor:"#404040", height:70, padding:3, paddingLeft: 15}}>
      <Stack direction="row" spacing={8}>
        <img src="/leetrogue logo.jpg" style={{ width: '70px', position:'absolute', left:0, top:0, height: 'auto' }} ></img>

        <Typography> LEET ROGUE </Typography>

        <Typography paddingLeft={20}> Aura Points: {points} </Typography>

        <Typography> If Loops: {ifloop} </Typography>

        <Typography> For/While Loops: {forloop} </Typography>

        <Typography> Import Statements: {imports} </Typography>
      </Stack>
    </AppBar>

    <Box display="flex" flexDirection="row" width="100vw" height="100vh">
      <Box width="50vw" padding={4} paddingRight={0} sx={{ gap:5, backgroundColor: theme.palette.primary.main, backgroundImage: `linear-gradient(rgba(5, 8, 45, 0.8), rgba(6, 9, 43, 0.8)), url('/leetrogue logo.jpg')`, backgroundRepeat: "no-repeat", backgroundSize: `500px 800px`}}>
        <Stack direction="row" spacing={2}>
          <EmojiObjectsTwoToneIcon fontSize='large' sx={{ color:"#FFFFFF" }}/>
          <Typography variant='h3'> Problem Set {question + 1}</Typography>
        </Stack>

        <Typography variant='h5' paddingTop={5}>
          {question === 0 && <span>Write a function that returns True if the parameter is even and False if the parameter is odd.</span>}
          {question === 1 && <span>Write a function that returns True if the number parameter is a palindrome and False if the number parameter is not a palindrome.</span>} 
          {question === 2 && <span>Given a list of numbers, x, find the maximum possible bitwise OR of a subset of x and return the number of different non-empty subsets that give that maximum OR.</span>}
          {question === 3 && <span>Given a string, find the longest palindromic substring.</span>}
          {question === 4 && <span>You are given n nodes and a list of directed edges (u, v, w) where u is the source node, v is the target node and w is the time taken. Given a node k, return the minimum time it takes for all n nodes to receive the signal. </span>} 
          {question === 5 && <span>Congrats! You won! </span>}  
        </Typography>
        <br/>   
        <br/>
        <Typography variant='h7' paddingTop={5} sx={{ color:"#FFFFFF" }}>
          {question === 0 && <span>Input: 5<br/>Output: False</span>}
          {question === 1 && <span>Input: 12321<br/>Output: True<br/><br/>Input: 589<br/>Output: False</span>} 
          {question === 2 && <span>Input: [2,2,2]<br/>Output: 7</span>}
          {question === 3 && <span>Input: "cbbd"<br/>Output: "bb"</span>}
          {question === 4 && <span>Input: [[1,2,1]], 2, 1<br/>Output: 1</span>}  
        </Typography>
      </Box>

      <Box display="flex" flexDirection="column" width="100vw" height="100vh" alignItems="center" padding={10} paddingTop={5}
        sx={{ gap:5, backgroundColor: theme.palette.secondary.main }}>
        <Typography variant="h3">Enter code here</Typography>
          
        <TextField
          fullWidth
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter your Python code here..."
          multiline
          rows={10} // Initial visible rows
          sx={{
            backgroundColor: "#404040",
            height: 350, // Fixed height for the TextField
            borderRadius: '8px', // Apply curved borders
            '& .MuiOutlinedInput-root': {
              height: '100%', // Make the container match the full height
              alignItems: 'start', // Align text to the top
              overflow: 'auto', // Add overflow for scrolling
              borderRadius: '8px', // Curved border for the input
              borderColor: 'white', // Set border color to white
              '& fieldset': {
                borderColor: 'white', // Ensure the outlined border is white
              },
              '&:hover fieldset': {
                borderColor: 'white', // Keep border white on hover
              },
              '&.Mui-focused fieldset': {
                borderColor: 'white', // Keep border white when focused
              },
            },
            '& .MuiOutlinedInput-input': {
              resize: 'none', // Disable manual resizing (optional)
              color: 'white', // Ensure text color is white for readability
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
          <Typography>{isLoading ? 'Running...' : 'Run Code'}</Typography>
        </Button>
        <Typography>
        {error}
        </Typography>

        {error && <ThumbDownAltIcon sx={{color:"white"}}/>}

        <Typography>  
        <div className="bg-gray-900 text-white p-4 rounded-lg font-mono whitespace-pre-wrap">
          {output }
        </div>
        </Typography>  

        {/* Use the extracted Dialogue component */}
        <Dialogue
          open={dialogOpen}
          onClose={handleDialogClose}
          onConfirm={handleConfirm}
          points={points}
        />
      </Box>
    </Box>
    </div>
  );
};

export default CodeEditor;