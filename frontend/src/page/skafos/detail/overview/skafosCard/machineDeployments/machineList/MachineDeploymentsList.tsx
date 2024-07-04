import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  Box,
  Button,
  Collapse,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import { useState } from "react";
import "./machine-deployments-list.css";

interface MachineDeploymentsItemProps {
  kubernetesVersion: string;
  machineTemplate: string;
  status: { key: string; value: string }[];
  index: number;
  name: string;
}

const MachineDeploymentsList: React.FC<MachineDeploymentsItemProps> = ({
  index,
  kubernetesVersion,
  machineTemplate,
  status,
  name,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Box>
      <Box className="machine-deployment-box">
        <Typography variant="body1" color="#000000" fontWeight="bold">
          {name}
        </Typography>
        <Button
          onClick={() => setExpanded(!expanded)}
          className="machine-deployment-button"
        >
          {expanded ? (
            <ExpandLess sx={{ color: "#000000" }} />
          ) : (
            <ExpandMore sx={{ color: "#000000" }} />
          )}
        </Button>
      </Box>
      <Collapse in={expanded} className="machine-deployment-collapse">
        <Box className="machine-deployment-collapse-content">
          <Typography variant="body2">
            <strong>Kubernetes Version:</strong> {kubernetesVersion}
          </Typography>
          <Typography variant="body2">
            <strong>Machine Template:</strong> {machineTemplate}
          </Typography>
          {status.map((item, idx) => (
            <Typography key={idx} variant="body2">
              <strong>{item.key}:</strong> {item.value}
            </Typography>
          ))}
        </Box>
      </Collapse>
      <Divider className="machine-deployment-divider" />
    </Box>
  );
};

export default MachineDeploymentsList;
