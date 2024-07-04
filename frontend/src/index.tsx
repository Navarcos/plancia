import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "./style/font/Poppins/Poppins-Black.ttf";
import { BrowserRouter } from "react-router-dom";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./auth/keycloak";
import { Box } from "@mui/material";
import "./redirect-loader.css";
import Spinner from "./shared/component/spinner/spinner";
import {Config} from "./config";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const RedirectLoader = () => {
  return (
    <Box className="redirect-loader-container">
      <Spinner />
    </Box>
  );
};

console.log(Config.apiUrl)
root.render(
  <ReactKeycloakProvider
    initOptions={{
      onLoad: "login-required",
      checkLoginIframe: true,
      pkceMethod: "S256",
    }}
    LoadingComponent={<RedirectLoader />}
    authClient={keycloak}
  >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ReactKeycloakProvider>
);
