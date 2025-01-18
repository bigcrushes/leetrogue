import React from 'react';
import { AppBar, Button, Box, Typography, TextField, Stack } from '@mui/material';
import Dialogue from './dialogue';

const CodeEditorUI = ({
  theme,
  question,
  code,
  setCode,
  executeCode,
  isLoading,
  backendStatus,
  points,
  ifloop,
  forloop,
  imports,
  error,
  output,
  dialogOpen,
  handleDialogClose,
  handleConfirm,
}) => {
  return (
    <div
      style={{
        backgroundImage: `url('/background.jpg')`, // Background image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed', // Fixed background
        width: '100vw',
        height: '100vh',
        color: 'black', // Default text color
      }}
    >
      {/* AppBar Section */}
      <AppBar
        position="static"
        sx={{
          borderBottom: '2px solid darkgreen', // Border below AppBar
        }}
      >
        <Stack direction="row" spacing={8} alignItems="center" padding={1}>
          <img src="/leetrogue logo.jpg" className="logo" alt="Logo" />
          <Typography color="inherit"> LEET ROGUE </Typography> {/* AppBar retains its default light color */}
          <Typography color="inherit" className="points">
            Aura Points: {points}
          </Typography>
          <Typography color="inherit"> If Loops: {ifloop} </Typography>
          <Typography color="inherit"> For Loops: {forloop} </Typography>
          <Typography color="inherit"> Import Statements: {imports} </Typography>
        </Stack>
      </AppBar>

      <Box
        display="flex"
        flexDirection="row"
        width="100%"
        height="calc(100% - 64px)"
        padding="16px" // Adds spacing inside the container
        gap="16px" // Adds spacing between the boxes
      >
        {/* Problem Section */}
        <Box
          sx={{
            width: '50%',
            height: '100%',
            padding: '16px',
            boxSizing: 'border-box',
            backgroundColor: '#333333', // Dark grey background
            border: '5px solid black',
            borderRadius: '12px',
            margin: '16px', // Adds margin around the box
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold', // Bold for the heading
              marginBottom: '8px',
              color: 'white', // White text color
            }}
          >
            Problem Set {question + 1}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'white', // White text color for the question
            }}
          >
            {question === 0
              ? 'Write a function that returns True if the parameter is even and False if the parameter is odd.'
              : 'Write a function that returns True if the number parameter is a palindrome and False if the number parameter is not a palindrome.'}
          </Typography>
        </Box>

        {/* Code Editor Section */}
        <Box
          sx={{
            width: '50%',
            padding: '16px',
            margin: '16px', // Adds margin around the box
            boxSizing: 'border-box',
          }}
        >
          <Typography variant="h3" gutterBottom sx={{ color: 'black' }}>
            Enter code here
          </Typography>

          <TextField
            fullWidth
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter your Python code here..."
            multiline
            rows={10}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                border: '5px solid black',
                height: '300px',
                backgroundColor: '#333333', // Dark grey background for the editor
                color: 'white', // White text color
                '&:hover': {
                  borderColor: 'limegreen',
                },
                '&.Mui-focused': {
                  borderColor: 'limegreen',
                  boxShadow: '0 0 5px limegreen',
                },
              },
            }}
            InputProps={{
              style: {
                height: '100%',
                overflow: 'auto',
              },
            }}
          />

          <Button
            onClick={executeCode}
            disabled={isLoading || backendStatus !== 'connected'}
            sx={{
              marginTop: '16px',
              backgroundColor: 'darkgreen',
              color: 'white',
              '&:hover': {
                backgroundColor: 'limegreen',
              },
            }}
          >
            {isLoading ? 'Running...' : 'Run Code'}
          </Button>

          <div
            className="output-box"
            style={{
              color: 'white', // White text color for the output
            }}
          >
            {output}
          </div>

          {/* Dialogue Component */}
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

export default CodeEditorUI;
