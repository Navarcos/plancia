import React from "react";
import { styled } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Account from "./Account";

import navarcosNegative from "../../style/assets/navarcosNegative_png.png";
import { useNavigate } from "react-router-dom";

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  backgroundColor: "#212121",
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const TopAppBar = (props: { open: boolean }) => {
  const navigate = useNavigate();

  const home = () => {
    navigate("/");
  };

  return (
    <AppBar style={{ zIndex: 999 }} open={props.open}>
      <Toolbar
        sx={{
          pr: "24px",
        }}
      >
        <Typography
          component="h1"
          variant="h4"
          color="inherit"
          noWrap
          sx={{
            flexGrow: 1,
            marginLeft: props.open ? 0 : "60px",
            cursor: "default",
          }}
        >
          <IconButton onClick={home} sx={{ cursor: "pointer" }}>
            <img
              src={navarcosNegative}
              alt="Navarcos"
              style={{ width: "300px", height: "34px", marginBottom: 3 }}
            />
          </IconButton>
        </Typography>
        <Account accountMenuOpen={() => {}} isLoggedIn={false} />
      </Toolbar>
    </AppBar>
  );
};

export default TopAppBar;
