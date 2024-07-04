import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  ThemeProvider,
  Typography,
  useTheme,
} from "@mui/material";
import DashboardLayout from "../../../../style/DashboardLayout";
import "./AdvancedSettings.css";
import { useState } from "react";
import DeleteModal from "../../../../shared/component/actionButton/deleteModal/DeleteModal";
import { useNavigate, useParams } from "react-router-dom";
import { SkafosApi } from "../../../../service/skafosApi";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import WarningIcon from "@mui/icons-material/Warning";
import { CustomTypography } from "../../../../style/font/CustomTypography";

export default function AdvancedSettings() {
  const theme = useTheme();
  const [deleteModal, setDeleteModal] = useState(false);
  const navigate = useNavigate();
  let { namespace, name } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  if (namespace === undefined || name === undefined) {
    navigate("/error");
  }

  const handleModal = () => {
    setDeleteModal(true);
  };

  const onClose = (del: boolean) => {
    if (del) {
      setIsLoading(true);
      SkafosApi.deleteSkafos(namespace!, name!)
        .then((res) => {
          console.log(res);
          navigate("/skafos")
        })
        .catch((err) => console.log(err))
        .finally(() => {
          setDeleteModal(false)
          setIsLoading(false);
        });

    } else {
      setDeleteModal(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <DashboardLayout>
        <Container maxWidth="xl" className="container-settings">
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
            className="adv-main-grid"
          >
            <Grid item xs={12} sm={10} md={8} lg={6}>
              <Paper elevation={3} className="adv-container-delete">
                <CustomTypography variant="h4">Delete Skafos</CustomTypography>
                <Typography variant="body1">
                  Deleting Skafos will remove all data and configurations.
                </Typography>
                <WarningIcon />
                <Typography variant="body2">
                  Please note: This action is irreversible.
                </Typography>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleModal}
                  startIcon={<DeleteForeverIcon />}
                >
                  Delete Skafos
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Container>
        <DeleteModal
          open={deleteModal}
          skafosName={name!}
          namespace={namespace!}
          onClose={onClose}
        />
      </DashboardLayout>
    </ThemeProvider>
  );
}
