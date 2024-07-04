import {
  Alert,
  AlertColor,
  Box,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  TextField,
  ThemeProvider,
  useTheme,
} from "@mui/material";
import DashboardLayout from "../../../../style/DashboardLayout";
import "../imports/imports.css";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CustomTypography } from "../../../../style/font/CustomTypography";
import openShiftLogo from "../../../../style/assets/openShift_png.png";
import kubernetesLogo from "../../../../style/assets/kubernetes_png (2).png";
import K3SLogo from "../../../../style/assets/K3s_png.png";
import { ButtonWithHover } from "../create/CreationStyle";
import { ResourceApi } from "../../../../service/resourceApi";

export default function Imports() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<AlertColor>("success");

  const [yamlData, setYamlData] = useState("");
  const [namespaceList, setNamespaceList] = useState<string[]>([]);
  const [namespace, setNamespace] = useState<string>("");

  const [clusterName, setClusterName] = useState<string>("");
  let { provider } = useParams();

  const addNewNamespace = async (namespace: string) => {
    Promise.resolve(ResourceApi.getNamespaces())
      .then(() => {
        if (!namespaceList.includes(namespace)) {
          setNamespaceList((prevList) => [...prevList, namespace]);
        }
        setSnackbarSeverity("success");
        setSnackbarMessage(`Namespace '${namespace}' added successfully!`);
        setSnackbarOpen(true);
      })
      .catch(() => {
        setSnackbarSeverity("error");
        setSnackbarMessage("Failed to add namespace. Please try again.");
        setSnackbarOpen(true);
      });
  };

  const handleAddNamespace = () => {
    if (namespace && !namespaceList.includes(namespace)) {
      addNewNamespace(namespace);
    }
  };

  async function sendData(
    value: any,
    namespace: string,
    clusterName: string
  ): Promise<void> {
    setIsLoading(true);
    Promise.resolve(
      ResourceApi.importConfig(value, provider!, namespace, clusterName)
    )
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
            <Box className="imp-namespace-select-container">
              <FormControl className="imp-namespace-box-select" margin="normal">
                <InputLabel id="namespace-select-label">
                  Select or Add Namespace:
                </InputLabel>
                <Select
                  labelId="namespace-select-label"
                  value={namespace}
                  variant="standard"
                >
                  {namespaceList.map((namespace) => (
                    <MenuItem key={namespace} value={namespace}>
                      {namespace}
                    </MenuItem>
                  ))}
                  <MenuItem value={namespace}>
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
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>
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
                  sendData(yamlData, clusterName, namespace);
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
