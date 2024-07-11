import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Box, Container, ThemeProvider } from "@mui/material";
import TopAppBar from "./shared/navbar/TopAppBar";
import CustomDrawer from "./shared/sidebar/Drawer";
import Footer from "./shared/footer/Footer";
import Skafos from "./page/skafos/detail/overview/Skafos";
import "./App.css";
import { SidebarContext } from "./shared/sidebar/SidebarContext";
import SkafosList from "./page/skafos/list/SkafosList";
import theme from "./style/responsiveTheme/customTheme";
import { NotFoundPage } from "./page/error/notFound";
import Deployments from "./page/skafos/detail/deployment/Deployments";
import Pods from "./page/skafos/detail/pod/Pods";
import Services from "./page/skafos/detail/service/Services";
import Ingresses from "./page/skafos/detail/ingress/Ingresses";
import Nodes from "./page/skafos/detail/node/Nodes";
import ConfigMaps from "./page/skafos/detail/configMap/ConfigMaps";
import AdvancedSettings from "./page/skafos/action/settings/AdvancedSettings";
import KubeConfig from "./page/skafos/detail/kubeConfig/Kube";
import CreationPage from "./page/skafos/action/create/vsphere/CreationPage";
import Pvc from "./page/skafos/detail/pvc/Pvc";
import Pv from "./page/skafos/detail/pv/Pv";
import HelmReleases from "./page/skafos/detail/helm/HelmReleases";
import MultiProvider from "./page/skafos/action/create/MultiProvider";
import KindCreation from "./page/skafos/action/create/kindForm/KindCreation";
import Import from "./page/skafos/action/import/Import";

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <ThemeProvider theme={theme}>
      <Box className="App">
        <Container
          className="app-container"
          maxWidth={false}
          style={{
            height: "auto",
            margin: "0vh",
            paddingTop: "10vh",
            paddingLeft: "8vh",
            paddingRight: "10vh",
            backgroundColor: "#f5f5f5",
          }}
        >
          <TopAppBar open={isSidebarOpen} />
          <SidebarContext.Provider value={{ isSidebarOpen }}>
            <CustomDrawer
              open={isSidebarOpen}
              setSidebarStatus={setIsSidebarOpen}
            />
            <Routes>
              <Route path="/" element={<SkafosList />} />
              <Route path="/skafos">
                <Route index={true} element={<SkafosList />} />,
                <Route
                  path="/skafos/create/vSphere"
                  element={<CreationPage />}
                />
                {/*<Route path="/skafos/create/import" element={<Import />} />*/}
                <Route
                  path="/skafos/create/docker"
                  element={<KindCreation />}
                />
                ,
                <Route path="/skafos/create" element={<MultiProvider />} />
                <Route path=":namespace/:name/:provider" element={<Skafos />} />
                <Route
                  path=":namespace/:name/kubeconfig"
                  element={<KubeConfig />}
                />
                <Route path=":namespace/:name/pods" element={<Pods />} />
                <Route path=":namespace/:name/nodes" element={<Nodes />} />
                <Route
                  path=":namespace/:name/deployments"
                  element={<Deployments />}
                />
                <Route
                  path=":namespace/:name/services"
                  element={<Services />}
                />
                <Route
                  path=":namespace/:name/ingresses"
                  element={<Ingresses />}
                />
                <Route
                  path=":namespace/:name/configMaps"
                  element={<ConfigMaps />}
                />
                <Route
                  path=":namespace/:name/persistentVolumeClaims"
                  element={<Pvc />}
                />
                <Route
                  path=":namespace/:name/persistentVolume"
                  element={<Pv />}
                />
                <Route
                  path=":namespace/:name/releases"
                  element={<HelmReleases />}
                />
                <Route
                  path=":namespace/:name/settings"
                  element={<AdvancedSettings />}
                />
              </Route>
              <Route path="/*" element={<NotFoundPage />}></Route>
            </Routes>
          </SidebarContext.Provider>
        </Container>
        <Footer />
      </Box>
    </ThemeProvider>
  );
};

export default App;
