import { createTheme } from "@mui/material/styles";
declare module "@mui/material/styles" {
  interface BreakpointOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
    xxl: true;
  }
}

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
      xxl: 2560,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          fontFamily: "CustomFont, Arial, sans-serif",
          overflowY: "auto",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          color: "grey",
          borderColor: "grey",
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          maxWidth: "none",
          [`@media (min-width:1920px)`]: {
            maxWidth: "none",
            margin: 0,
            padding: 0,
          },
        },
        maxWidthLg: {
          [`@media (min-width:1280px)`]: {
            maxWidth: "none",
          },
        },
        maxWidthXl: {
          [`@media (min-width:1920px)`]: {
            maxWidth: "none",
          },
        },
      },
    },
  },
  typography: {
    fontFamily: ["CustomFont, Arial, sans-serif"].join(","),
  },
});

export default theme;
