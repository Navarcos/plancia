import { IconButton, Menu, MenuItem } from "@mui/material";
import React, { useState } from "react";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import EditIcon from "@mui/icons-material/Edit";
import "../actionButtons/action-button.css";
import MachineDepNodesModal from "../scaleModal/MachineDepNodesModal";
import { SkafosApi } from "../../../../service/skafosApi";

interface NodesProps {
  namespace: string;
  name: string;
  nodes: number;
  onWorkerNodesChange: (newNodes: number) => void;
}

const ActionButtonWorker: React.FC<NodesProps> = ({
  namespace,
  name,
  nodes,
  onWorkerNodesChange,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [workerNodes, setWorkerNodes] = useState<number>(nodes);

  const [workerModalOpen, setWorkerModalOpen] = useState<boolean>(false);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleScaleWorker = () => {
    setWorkerModalOpen(true);
    handleMenuClose();
  };

  const handleWorkerNodesChange = (value: number) => {
    const newValue = Math.max(1, value);
    Promise.resolve(SkafosApi.patchMachine(namespace, name, nodes))
      .then(() => {
        setWorkerNodes(newValue);
        onWorkerNodesChange(newValue);
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      <IconButton
        className="scaleIcon"
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleMenuClick}
      >
        <DesignServicesIcon />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleScaleWorker}>
          Scale <EditIcon className="scaleIcon" />
        </MenuItem>
      </Menu>
      <MachineDepNodesModal
        open={workerModalOpen}
        onClose={() => setWorkerModalOpen(false)}
        workerNodes={workerNodes}
        onWorkerNodesChange={handleWorkerNodesChange}
      />
    </>
  );
};

export default ActionButtonWorker;
