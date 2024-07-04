import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import theme from "../../../style/responsiveTheme/customTheme";
import SkafosTable from "./grid/SkafosTable";
import "./skafos-list.css";

const SkafosList: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <Box
                className="skafos-list-box"
                sx={{
                    backgroundColor: (theme) =>
                        theme.palette.mode === "light"
                            ? theme.palette.grey[100]
                            : theme.palette.grey[900],
                }}
            >
                <CssBaseline />
                <Container maxWidth="xl">
                    <SkafosTable />
                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default SkafosList;
