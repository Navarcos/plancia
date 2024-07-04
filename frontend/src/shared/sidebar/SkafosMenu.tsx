import React from "react";
import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import ViewQuiltIcon from "@mui/icons-material/ViewQuilt";
import ViewInArIcon from "@mui/icons-material/ViewInAr";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import { Link, useLocation } from "react-router-dom";
import { Home } from "@mui/icons-material";
import List from "@mui/material/List";
import SettingsIcon from "@mui/icons-material/Settings";
import BuildIcon from "@mui/icons-material/Build";
import StartIcon from "@mui/icons-material/Start";
import DnsIcon from "@mui/icons-material/Dns";
import KeyIcon from "@mui/icons-material/Key";
import FilePresentIcon from "@mui/icons-material/FilePresent";
import StorageIcon from "@mui/icons-material/Storage";
import MyLocationIcon from "@mui/icons-material/MyLocation";

const SkafosMenu: React.FC = () => {
  const location = useLocation();
  let basePath = extractSkafosPath(location.pathname);

  const subMenuList = [
    { text: "Home", icon: <Home />, link: "/" },
    { text: "Overview", icon: <ViewQuiltIcon />, link: basePath + "/provider" },
    {
      text: "KubeConfig",
      icon: <FilePresentIcon />,
      link: basePath + "/kubeConfig",
    },
    { text: "Pod", icon: <ViewInArIcon />, link: basePath + "/pods" },
    { text: "Node", icon: <DnsIcon />, link: basePath + "/nodes" },
    {
      text: "Deployment",
      icon: <AccountTreeIcon />,
      link: basePath + "/deployments",
    },
    { text: "Service", icon: <BuildIcon />, link: basePath + "/services" },
    { text: "Ingress", icon: <StartIcon />, link: basePath + "/ingresses" },
    { text: "ConfigMap", icon: <KeyIcon />, link: basePath + "/configMaps" },
    {
      text: "Helm Releases",
      icon: <MyLocationIcon />,
      link: basePath + "/releases",
    },
    {
      text: "PV",
      icon: <StorageIcon />,
      link: basePath + "/persistentVolume",
    },
    {
      text: "PVC",
      icon: <StorageIcon />,
      link: basePath + "/persistentVolumeClaims",
    },
    { text: "Advanced", icon: <SettingsIcon />, link: basePath + "/settings" },
  ];

  return (
    <List>
      {subMenuList.map((item, index) => (
        <ListItemButton key={item.text} component={Link} to={item.link}>
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItemButton>
      ))}
    </List>
  );
};

function extractSkafosPath(location: string): string {
  let split = location.split("/");
  return split.slice(0, 4).join("/");
}

export default SkafosMenu;
