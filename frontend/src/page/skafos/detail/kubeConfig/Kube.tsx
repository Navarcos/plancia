import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import theme from "../../../../style/responsiveTheme/customTheme";
import KubeConfigCard from "./KubeConfig";
import "../shared-layout.css";

function KubeConfig() {
  return (
    <ThemeProvider theme={theme}>
      <Box
        className="shared-list-box"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
        }}
      >
        <CssBaseline />
        <Container>
          <KubeConfigCard skafosNamespace={""} skafosName={""} />
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default KubeConfig;
