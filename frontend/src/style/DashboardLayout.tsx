import React, { ReactNode } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import theme from "./responsiveTheme/customTheme";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        marginLeft="5vw"
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          height: "100vh",
          overflow: "auto",
          p: 0,
        }}
      >
        {children}
      </Box>
    </ThemeProvider>
  );
};

export default DashboardLayout;
