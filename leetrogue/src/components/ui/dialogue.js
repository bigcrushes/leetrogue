import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const Dialogue = ({ open, onClose, onConfirm, points }) => {
  // State for tracking the counts of each option
  const [selectionCounts, setSelectionCounts] = useState({
    ifLoop: 0,
    forLoop: 0,
    imports: 0,
  });

  // Function to calculate the total points deduction
  const calculateDeduction = () => {
    return (
      selectionCounts.ifLoop * 10 +
      selectionCounts.forLoop * 30 +
      selectionCounts.imports * 50
    );
  };

  // Calculate remaining points
  const remainingPoints = Math.max(points - calculateDeduction(), 0);

  // Function to handle increment for a specific option
  const handleIncrement = (key, cost) => {
    // Prevent increment if it would drop remaining points below 0
    if (remainingPoints - cost >= 0) {
      setSelectionCounts((prev) => ({ ...prev, [key]: prev[key] + 1 }));
    }
  };

  // Function to handle decrement for a specific option
  const handleDecrement = (key) => {
    setSelectionCounts((prev) => ({
      ...prev,
      [key]: Math.max(0, prev[key] - 1), // Prevent the count from going below 0
    }));
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle color="black">Choose an Option</DialogTitle>
      <DialogContent>
        <Typography color="black">Points Remaining: {remainingPoints}</Typography>
        <Box display="flex" flexDirection="column" gap={2} marginTop={2}>

          {/* Map through the options and dynamically render UI */}
          {[
            { label: "Extra if loop (-10 points)", key: "ifLoop", cost: 10 },
            { label: "Extra for loop (-30 points)", key: "forLoop", cost: 30 },
            { label: "Extra import (-50 points)", key: "imports", cost: 50 },
          ].map((option) => (
            <Box
              key={option.key}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              padding={1}
              border="1px solid #ddd"
              borderRadius={1}
            >
              {/* Decrement Button */}
              <IconButton
                onClick={() => handleDecrement(option.key)}
                disabled={selectionCounts[option.key] === 0}
              >
                <RemoveIcon />
              </IconButton>

              {/* Main Button Showing Option Label and Count */}
              <Button
                variant="outlined"
                fullWidth
                onClick={() => console.log(option.label)}
              >
                {option.label} ({selectionCounts[option.key]})
              </Button>

              {/* Increment Button */}
              <IconButton
                onClick={() => handleIncrement(option.key, option.cost)}
                disabled={remainingPoints < option.cost} // Disable if not enough points
              >
                <AddIcon />
              </IconButton>
            </Box>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            onConfirm({ selectionCounts, remainingPoints }); // Pass the current selections
            setSelectionCounts({ ifLoop: 0, forLoop: 0, imports: 0 }); // Reset counts
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Dialogue;

