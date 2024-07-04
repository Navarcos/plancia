import React, { Component } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {process.env.NODE_ENV}
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Navarcos
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

class Footer extends Component {
  render() {
    const defaultTheme = createTheme();
    return (
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <Box
          component="footer"
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            bgcolor: "#f5f5f5",
            py: 2,
          }}
        >
          <Container maxWidth="sm">
            <Copyright />
          </Container>
        </Box>
      </ThemeProvider>
    );
  }
}

export default Footer;
