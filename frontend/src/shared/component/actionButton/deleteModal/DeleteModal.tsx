import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import "../actionButtons/action-button.css";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import React, { useState } from "react";

interface SettingsModalProps {
  open: boolean;
  onClose: (value: boolean) => void;
  skafosName: string;
  namespace: string;
}

const DeleteModal: React.FC<SettingsModalProps> = ({
  open,
  skafosName,
  namespace,
  onClose,
}) => {
  let [skafosText, setSkafosText] = useState("");

  return (
    <Dialog open={open}>
      <DialogTitle>Delete Skafos</DialogTitle>
      <DialogContent className="dialog-content">
        <Typography className="content-title">
          Are you sure you want to delete this Skafos?
        </Typography>
        <Typography className="content-info">
          <InfoOutlinedIcon className="icon-color-red" /> Deleting Skafos will
          remove all data and configurations. This action is irreversible.
        </Typography>
        <Typography className="text-container">
          Enter the following to confirm:
        </Typography>
        <Typography className="skafos-name-container">{skafosName}</Typography>
        <TextField
          id="outlined-basic"
          label="skafos-name"
          variant="outlined"
          value={skafosText}
          onChange={(e) => setSkafosText(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => onClose(false)}
          className="cancel-button"
          style={{
            backgroundColor: "white",
            color: "black",
          }}
        >
          Back
        </Button>
        <Button
          onClick={() => onClose(true)}
          disabled={skafosText !== skafosName}
          className="confirm-button"
          style={{
            background: "red",
            color: "white",
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteModal;
