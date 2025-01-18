import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Paper, Box, Button, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Dialogue = ({ open, onClose, onConfirm, selectedBox, setSelectedBox }) => {
  const theme = useTheme();

  const handleBoxClick = (index) => {
    setSelectedBox(index); // Update the selected box state
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Select an Option</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="row" gap={2} justifyContent="center">
          {[1, 2, 3].map((item, index) => (
            <Paper
              key={index}
              onClick={() => handleBoxClick(index)}
              elevation={selectedBox === index ? 6 : 2}
              sx={{
                width: 100,
                height: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: selectedBox === index ? `2px solid ${theme.palette.primary.main}` : '1px solid gray',
                backgroundColor: selectedBox === index ? theme.palette.primary.light : 'white',
              }}
            >
              <Typography>Option {item}</Typography>
            </Paper>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={onConfirm}
          disabled={selectedBox === null}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Dialogue;
