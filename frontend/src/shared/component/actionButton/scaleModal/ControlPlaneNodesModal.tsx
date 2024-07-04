import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField,} from "@mui/material";
import "../actionButtons/action-button.css";
import React, {useState} from "react";
import ClearIcon from "@mui/icons-material/Clear";

interface MasterNodesModalProps {
    open: boolean;
    onClose: () => void;
    masterNodes: number;
    onMasterNodesChange: (value: number) => void;
}

const ControlPlaneNodesModal: React.FC<MasterNodesModalProps> = ({
                                                                     open,
                                                                     onClose,
                                                                     masterNodes,
                                                                     onMasterNodesChange,
                                                                 }) => {
    const [modifiedMasterNodes, setModifiedMasterNodes] = useState(masterNodes);

    const handleMasterNodesChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = Math.max(1, Number(event.target.value));
        setModifiedMasterNodes(value);
    };


    const handleConfirm = () => {
        onMasterNodesChange(modifiedMasterNodes);
        onClose();
    };
    const handleCancel = () => {
        setModifiedMasterNodes(masterNodes);
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleCancel}>
            <DialogTitle>
                Scale Nodes
                <IconButton
                    aria-label="close"
                    onClick={handleCancel}
                    className="close-icon"
                >
                    <ClearIcon/>
                </IconButton>
            </DialogTitle>
            <DialogContent className="dialog-content">
                <Box className="field-box">
                    <TextField
                        label="Master Nodes"
                        type="number"
                        value={modifiedMasterNodes}
                        onChange={handleMasterNodesChange}
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

export default ControlPlaneNodesModal;
