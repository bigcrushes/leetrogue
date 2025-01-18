import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography } from "@mui/material";

const Dialogue = ({ open, onClose, onConfirm, selectedBox, setSelectedBox, points }) => {
  const handleBoxSelect = (box) => {
    setSelectedBox(box);
  };

  const calculateDeduction = () => {
    if (selectedBox === "ifLoop") return 10;
    if (selectedBox === "forLoop") return 20;
    if (selectedBox === "imports") return 50;
    return 0;
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Choose an Option</DialogTitle>
      <DialogContent>
        <Typography>Points: {points - calculateDeduction()}</Typography>
        <Box display="flex" flexDirection="column" gap={2} marginTop={2}>
          <Button
            variant={selectedBox === "ifLoop" ? "contained" : "outlined"}
            onClick={() => handleBoxSelect("ifLoop")}
          >
            Extra if loop (-10 points)
          </Button>
          <Button
            variant={selectedBox === "forLoop" ? "contained" : "outlined"}
            onClick={() => handleBoxSelect("forLoop")}
          >
            Extra for loop (-20 points)
          </Button>
          <Button
            variant={selectedBox === "imports" ? "contained" : "outlined"}
            onClick={() => handleBoxSelect("imports")}
          >
            Extra import (-50 points)
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} disabled={!selectedBox}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Dialogue;
