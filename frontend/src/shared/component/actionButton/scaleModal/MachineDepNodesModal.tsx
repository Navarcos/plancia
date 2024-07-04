import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import "../actionButtons/action-button.css";
import React, { useState } from "react";
import ClearIcon from "@mui/icons-material/Clear";
interface WorkerNodesModalProps {
  open: boolean;
  onClose: () => void;
  workerNodes: number;
  onWorkerNodesChange: (value: number) => void;
}

const MachineDepNodesModal: React.FC<WorkerNodesModalProps> = ({
  open,
  onClose,
  workerNodes,
  onWorkerNodesChange,
}) => {
  const [modifiedWorkerNodes, setModifiedWorkerNodes] = useState(workerNodes);

  const handleWorkerNodesChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Math.max(1, Number(event.target.value));
    setModifiedWorkerNodes(value);
  };

  const handleConfirm = () => {
    onWorkerNodesChange(modifiedWorkerNodes);
    onClose();
  };

  const handleCancel = () => {
    setModifiedWorkerNodes(workerNodes);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        Scale Nodes
        <IconButton aria-label="close" onClick={onClose} className="close-icon">
          <ClearIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className="dialog-content">
        <Box className="field-box">
          <TextField
            label="Worker Nodes"
            type="number"
            value={modifiedWorkerNodes}
            onChange={handleWorkerNodesChange}
            inputProps={{ min: 1 }}
            className="text-field"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleCancel}
          className="cancel-button"
          style={{
            backgroundColor: "white",
            color: "black",
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          className="confirm-button"
          style={{
            background: "black",
            color: "white",
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MachineDepNodesModal;
