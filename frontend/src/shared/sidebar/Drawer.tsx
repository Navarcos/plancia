import React from "react";
import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import { useLocation } from "react-router-dom";
import MainMenu from "./MainMenu";
import SkafosMenu from "./SkafosMenu";
import { Container } from "@mui/material";
import "../sidebar/drawer.css";
const drawerWidth = 240;

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const CustomDrawer = (props: {
  open: boolean;
  setSidebarStatus: (arg: boolean) => any;
}) => {
  const location = useLocation();
  let regex = /^\/skafos\/.+/;
  let createPath = /\/create/;
  const isSkafosCreate = createPath.test(location.pathname);
  const isSkafosOverview = regex.test(location.pathname);

  return (
    <Container
      onMouseEnter={() => {
        props.setSidebarStatus(true);
      }}
      onMouseLeave={() => {
        props.setSidebarStatus(false);
      }}
    >
      <Drawer variant="permanent" open={props.open}>
        <Toolbar className="toolbar"></Toolbar>
        <Divider />
        {(isSkafosOverview && !isSkafosCreate) ? <SkafosMenu /> : <MainMenu />}
      </Drawer>
    </Container>
  );
};

export default CustomDrawer;
