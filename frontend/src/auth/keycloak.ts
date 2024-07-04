import Keycloak from "keycloak-js";
import {Config} from "../config";


const keycloak = new Keycloak({
    url: Config.keycloakUrl!,
    realm: Config.keycloakRealm!,
    clientId: Config.keycloakClientId!,
});

export default keycloak;

