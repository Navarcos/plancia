const envSettings = window as any

export class Config {
    static apiUrl = envSettings.ENVIRONMENT.SERVER_URL
    static pollingInterval = envSettings.ENVIRONMENT.POLLING_INTERVAL
    static keycloakUrl = envSettings.ENVIRONMENT.KEYCLOAK_URL
    static keycloakRealm = envSettings.ENVIRONMENT.KEYCLOAK_REALM
    static keycloakClientId = envSettings.ENVIRONMENT.KEYCLOAK_CLIENT_ID
}