import {
  Alert,
  AlertColor,
  Box,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Paper,
  Snackbar,
  TextField,
  ThemeProvider,
  useTheme,
} from "@mui/material";
import DashboardLayout from "../../../../style/DashboardLayout";
import "./import.css";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CustomTypography } from "../../../../style/font/CustomTypography";
import openShiftLogo from "../../../../style/assets/openShift_png.png";
import kubernetesLogo from "../../../../style/assets/kubernetes_png (2).png";
import K3SLogo from "../../../../style/assets/K3s_png.png";
import { ButtonWithHover } from "../create/CreationStyle";
import { ResourceApi } from "../../../../service/resourceApi";

interface ExternalCluster {
  namespace: string;
  name: string;
  provider: string;
  kubeconfig: string;
}

export default function Import() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<AlertColor>("success");

  const [yamlData, setYamlData] = useState("");
  const [namespace, setNamespace] = useState<string>("");
  const [clusterName, setClusterName] = useState<string>("");
  const [provider, setProvider ] = useState<string>("");
  console.log("Provider " + provider)

  async function sendData(value: ExternalCluster): Promise<void> {
    setIsLoading(true);
    Promise.resolve(ResourceApi.importConfig(value))
      .then(() => {
        setSnackbarOpen(true);
        setSnackbarSeverity("success");
        setSnackbarMessage("KubeConfig imported successfully!");
      })
      .catch(() => {
        setSnackbarOpen(true);
        setSnackbarSeverity("error");
        setSnackbarMessage("Failed to import KubeConfig, please try again.");
      })
      .finally(() => {
        setIsLoading(false);
        setOpen(false);
      });
  }

  const handleCardClick = (value: any) => {
    setYamlData("");
    setOpen(true);
    setProvider(value)
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <DashboardLayout>
        <Container className="imp-container-settings">
          <Grid
            container
            spacing={6}
            justifyContent="center"
            alignItems="center"
            className="imp-main-grid"
          >
            <Grid item xs={4} sm={3} md={2} lg={4}>
              <Paper
                elevation={3}
                className="imp-cards"
                onClick={() => handleCardClick("OpenShift")}
              >
                <Box className="imp-card-content">
                  <CustomTypography variant="h4">OpenShift</CustomTypography>
                  <img
                    src={openShiftLogo}
                    alt="OpenShift"
                    className="imp-card-image"
                  />
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={4} sm={3} md={2} lg={4}>
              <Paper
                elevation={3}
                className="imp-cards"
                onClick={() => handleCardClick("Kubernetes")}
              >
                <Box className="imp-card-content">
                  <CustomTypography variant="h4">Kubernetes</CustomTypography>
                  <img
                    src={kubernetesLogo}
                    alt="Kubernetes"
                    className="imp-card-image"
                  />
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={4} sm={3} md={2} lg={4}>
              <Paper
                elevation={3}
                className="imp-cards"
                onClick={() => handleCardClick("K3S")}
              >
                <Box className="imp-card-content">
                  <CustomTypography variant="h4">K3S</CustomTypography>
                  <img src={K3SLogo} alt="K3S" className="imp-card-image" />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>

        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogContent>
            <CustomTypography variant="h6">Namespace:</CustomTypography>
            <TextField
              placeholder="Enter new namespace"
              value={namespace}
              onChange={(e) => setNamespace(e.target.value)}
              fullWidth
              variant="outlined"
              InputProps={{ style: { border: "none" } }}
              sx={{
                "& fieldset": {
                  border: "none",
                },
              }}
              onClick={(e) => e.stopPropagation()}
            />
            <CustomTypography variant="h6">Name:</CustomTypography>
            <TextField
              placeholder="Enter config name"
              fullWidth
              value={clusterName}
              onChange={(e) => setClusterName(e.target.value)}
              variant="outlined"
              InputProps={{ style: { border: "none" } }}
              sx={{
                "& fieldset": {
                  border: "none",
                },
              }}
            />
            <CustomTypography variant="h6">Kubeconfig:</CustomTypography>
            <TextField
              multiline
              fullWidth
              rows={20}
              value={yamlData}
              onChange={(e) => setYamlData(e.target.value)}
              variant="outlined"
              className="imp-textfield"
            />
          </DialogContent>
          <DialogActions>
            <Box className="imp-bottom-buttons">
              <ButtonWithHover
                className="imp-back-button"
                onClick={handleClose}
              >
                Close
              </ButtonWithHover>
              <ButtonWithHover
                onClick={() => {
                  sendData({
                    name: clusterName,
                    namespace: namespace,
                    provider: provider!,
                    kubeconfig: yamlData,
                  });
                }}
              >
                Save
              </ButtonWithHover>
            </Box>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </DashboardLayout>
    </ThemeProvider>
  );
}
