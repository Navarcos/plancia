import React from "react";
import { CustomTypography } from "../../../../style/font/CustomTypography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
import "./vsphere/creation-page.css";
import "./multi-provider.css";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import theme from "../../../../style/responsiveTheme/customTheme";
import DashboardLayout from "../../../../style/DashboardLayout";
import { Grid, Paper } from "@mui/material";

const MultiProvider: React.FC = () => {
  const navigate = useNavigate();
  const [provider, setProvider] = React.useState<string>("");

  const handleProviderChange = (event: SelectChangeEvent<string>) => {
    const selectedProvider = event.target.value as string;
    setProvider(selectedProvider);
    if (selectedProvider === "vSphere") {
      navigate(`/skafos/create/${selectedProvider}`);
    }

    if (selectedProvider === "Docker") {
      navigate(`/skafos/create/${selectedProvider}`);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <DashboardLayout>
        <CssBaseline />
        <Container>
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
            className="multip-grid"
          >
            <Grid item xs={12} sm={10} md={8} lg={6}>
              <Paper elevation={3} className="multip-paper">
                <CustomTypography
                  variant="h4"
                  gutterBottom
                  className="multip-title"
                >
                  Select Provider:
                </CustomTypography>

                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  className="provider-box"
                >
                  <FormControl fullWidth>
                    <InputLabel>Provider:</InputLabel>
                    <Select
                      labelId="Provider-label"
                      id="Provider-select"
                      value={provider}
                      label="Provider"
                      onChange={handleProviderChange}
                    >
                      <MenuItem value={"vSphere"}>vSphere</MenuItem>
                      <MenuItem value={"Azure"}>Azure</MenuItem>
                      <MenuItem value={"Docker"}>Docker</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </DashboardLayout>
    </ThemeProvider>
  );
};
export default MultiProvider;
