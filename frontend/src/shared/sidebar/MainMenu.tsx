import React from "react";
import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Link } from "react-router-dom";
import List from "@mui/material/List";
import SettingsIcon from "@mui/icons-material/Settings";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import {Config} from "../../config"

const MainMenu: React.FC = () => {
  const mainMenuList = [
    { text: "Skafos", icon: <FolderIcon />, link: "/skafos" },
    { text: "New Skafos", icon: <AddCircleIcon />, link: "/skafos/create" },
    // {
    //   text: "Import",
    //   icon: <ImportExportIcon />,
    //   link: "/skafos/create/import",
    // },
  ];

  return (
    <List>
      {mainMenuList.map((item, index) => (
        <ListItemButton key={item.text} component={Link} to={item.link}>
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItemButton>
      ))}

      <ListItemButton key="Realm" onClick={redirectToKeycloak}>
        <ListItemIcon>{<SettingsIcon></SettingsIcon>}</ListItemIcon>
        <ListItemText primary="Realm" />
      </ListItemButton>
    </List>
  );
};

function redirectToKeycloak() {
  let adminUrl =
    Config.keycloakUrl +
    "/admin/" +
      Config.keycloakRealm +
    "/console";
  window.open(adminUrl, "_blank")?.focus();
}

export default MainMenu;
