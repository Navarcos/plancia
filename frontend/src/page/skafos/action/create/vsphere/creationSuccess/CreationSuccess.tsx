import { Box, Container, Grid, ThemeProvider, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./creation-success.css";
import DashboardLayout from "../../../../../../style/DashboardLayout";
import theme from "../../../../../../style/responsiveTheme/customTheme";

function CreationSuccess() {
  const text = "Skafos Created Successfully!".split(" ");
  return (
    <ThemeProvider theme={theme}>
      <DashboardLayout>
        <Container className="confirmation-container">
          <Grid container justifyContent="center" alignItems="center">
            <Grid item xs={12}>
              <Typography variant="h4" className="confirmation-message">
                {text.map((el, i) => (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.25,
                      delay: i / 10,
                    }}
                    key={i}
                  >
                    {el}{" "}
                  </motion.span>
                ))}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Box>
                <Button
                  component={Link}
                  to="/skafos"
                  variant="outlined"
                  size="large"
                  className="confirmation-button"
                >
                  Go to Skafos List
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </DashboardLayout>
    </ThemeProvider>
  );
}

export default CreationSuccess;
