import React, { useState } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import OpenInFull from "@mui/icons-material/OpenInFull";
import "./machine-deployments-card.css";
import HubIcon from "@mui/icons-material/Hub";
import ActionButtonWorker from "../../../../../../../shared/component/actionButton/actionButtons/ActionButtonWorker";
import AnimatedContainer from "../../../../../../../style/Animation";
import { CustomTypography } from "../../../../../../../style/font/CustomTypography";

interface MachineDeploymentsCardProps {
  deployments: {
    namespace: string;
    name: string;
    nodes: number;
    status: { key: string; value: string }[];
  }[];
}

const MachineDeploymentsCard: React.FC<MachineDeploymentsCardProps> = ({
  deployments,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deploymentList, setDeploymentList] = useState(deployments);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleWorkerNodesChange = (index: number, newNodes: number) => {
    setDeploymentList((currentDeployments) =>
      currentDeployments.map((currentDeployment, currentIndex) =>
        currentIndex === index
          ? { ...currentDeployment, nodes: newNodes }
          : currentDeployment
      )
    );
  };

  return (
    <AnimatedContainer>
      <Box className="machine-deployment-card-content">
        <Box className="machine-title-box">
          <CustomTypography variant="h6" color="textPrimary" gutterBottom>
            Machine Deployments
            {/*todo: check if scale is working for each machine deploy*/}
            {/* <ActionButtonWorker
              nodes={deployments[0].nodes}
              namespace={deployments[0].namespace}
              name={deployments[0].name}
            /> */}
          </CustomTypography>
          <IconButton onClick={handleDialogOpen}>
            <OpenInFull fontSize="small" className="md-icons" />
          </IconButton>
        </Box>

        {deployments.map((deployment, index) => (
          <Box key={index} className="machine-list-box">
            <Typography variant="body2" gutterBottom>
              {deployment.name}
              <ActionButtonWorker
                namespace={deployment.namespace}
                name={deployment.name}
                nodes={deployment.nodes}
                onWorkerNodesChange={(newNodes: number) =>
                  handleWorkerNodesChange(index, newNodes)
                }
              />
            </Typography>
            <Grid container spacing={2}>

              {deployment.status.map((item, idx) => (
                <React.Fragment key={idx}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" fontWeight="bold">
                      {item.key}:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Typography variant="body2" color="textPrimary">
                      {item.value}
                    </Typography>
                  </Grid>
                </React.Fragment>
              ))}
            </Grid>
          </Box>
        ))}

        <Dialog
          open={dialogOpen}
          onClose={handleDialogClose}
          maxWidth="md"
          fullWidth
          className="machine-deployment-dialog"
        >
          <DialogTitle className="machine-deployment-dialog-title">
            <CustomTypography>
              All Machine Deployments Details:
            </CustomTypography>
          </DialogTitle>
          <DialogContent>
            {deployments.map((deployment, index) => (
              <Box key={index} mb={2}>
                <Typography variant="h6" className="body1">
                  <HubIcon className="md-scale-icon" />
                  {deployment.name}
                  <ActionButtonWorker
                    namespace={deployment.namespace}
                    name={deployment.name}
                    nodes={deployment.nodes}
                    onWorkerNodesChange={(newNodes: number) =>
                      handleWorkerNodesChange(index, newNodes)
                    }
                  />
                </Typography>

                <Grid container spacing={2}>
                  {deployment.status.map((item, idx) => (
                    <React.Fragment key={idx}>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="body2" fontWeight="bold">
                          {item.key}:
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={8}>
                        <Typography variant="body2" color="textPrimary">
                          {item.value}
                        </Typography>
                      </Grid>
                    </React.Fragment>
                  ))}
                </Grid>
                <hr className="machine-deployment-dialog-hr" />
              </Box>
            ))}
          </DialogContent>
        </Dialog>
      </Box>
    </AnimatedContainer>
  );
};

export default MachineDeploymentsCard;
