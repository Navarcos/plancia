package configs

import (
	"fmt"
	"github.com/spf13/viper"
	"strings"
	"time"
)

var config *Config

func Global() *Config {
	return config
}

const Local = "local"

type Config struct {
	ServiceName       string            `mapstructure:"service-name"`
	HelmRepoUrl       string            `mapstructure:"helm-repo-url"`
	NavarcosCa        string            `mapstructure:"navarcos-ca"`
	Server            Server            `mapstructure:"server"`
	ManagementCluster ManagementCluster `mapstructure:"management-cluster"`
	Logger            Logger            `mapstructure:"logger"`
	Keycloak          Keycloak          `mapstructure:"keycloak"`
}

type Server struct {
	Port     int      `mapstructure:"port"`
	Timeouts Timeouts `mapstructure:"timeouts"`
	Cors     Cors     `mapstructure:"cors"`
}

type Cors struct {
	AllowCredentials bool     `mapstructure:"allow-credentials"`
	MaxAge           int      `mapstructure:"max-age"`
	AllowOrigin      []string `mapstructure:"allow-origin"`
	AllowHeaders     []string `mapstructure:"allow-headers"`
	AllowMethods     []string `mapstructure:"allow-methods"`
	ExposeHeaders    []string `mapstructure:"expose-headers"`
}

type Keycloak struct {
	Url            string         `mapstructure:"url"`
	Realm          string         `mapstructure:"realm"`
	ClientTimeout  int            `mapstructure:"client-timeout"`
	AuthClient     KeycloakClient `mapstructure:"auth-client"`
	ServiceAccount KeycloakClient `mapstructure:"service-account"`
}

type KeycloakClient struct {
	ClientId string `mapstructure:"clientId"`
	Secret   string `mapstructure:"secret"`
}

type Timeouts struct {
	Read     int `mapstructure:"read"`
	Write    int `mapstructure:"write"`
	Shutdown int `mapstructure:"shutdown"`
	Headers  int `mapstructure:"headers"`
	Idle     int `mapstructure:"idle"`
}

type ManagementCluster struct {
	Kubeconfig      string `mapstructure:"kubeconfig"`
	CreationTimeout int    `mapstructure:"creation-timeout"`
}

type Logger struct {
	Level string `mapstructure:"level"`
}

func (c *Config) GetCreationTimeout() time.Duration {
	return time.Duration(c.ManagementCluster.CreationTimeout) * time.Hour
}

func LoadConfig(path, fileName string) error {
	config = initDefaultValues()
	err := addEnvValues()
	if err != nil {
		return err
	}
	return nil
}

func addEnvValues() error {
	viper.AutomaticEnv()
	keycloakUrl := viper.Get("KEYCLOAK_URL")
	if keycloakUrl == nil {
		return fmt.Errorf("missing env variable KEYCLOAK_URL")
	}
	config.Keycloak.Url = keycloakUrl.(string)

	keycloakRealm := viper.Get("KEYCLOAK_REALM")
	if keycloakRealm == nil {
		return fmt.Errorf("missing env variable KEYCLOAK_REALM")
	}
	config.Keycloak.Realm = keycloakRealm.(string)

	keycloakServiceAccountId := viper.Get("KEYCLOAK_SERVICE_ACCOUNT_ID")
	if keycloakServiceAccountId == nil {
		return fmt.Errorf("missing env variable KEYCLOAK_SERVICE_ACCOUNT_ID")
	}
	config.Keycloak.ServiceAccount.ClientId = keycloakServiceAccountId.(string)

	keycloakServiceAccountSecret := viper.Get("KEYCLOAK_SERVICE_ACCOUNT_SECRET")
	if keycloakServiceAccountSecret == nil {
		return fmt.Errorf("missing env variable KEYCLOAK_SERVICE_ACCOUNT_SECRET")
	}
	config.Keycloak.ServiceAccount.Secret = keycloakServiceAccountSecret.(string)

	keycloakAuthClientId := viper.Get("KEYCLOAK_AUTH_CLIENT_ID")
	if keycloakAuthClientId == nil {
		return fmt.Errorf("missing env variable KEYCLOAK_AUTH_CLIENT_ID")
	}
	config.Keycloak.AuthClient.ClientId = keycloakAuthClientId.(string)

	keycloakAuthClientSecret := viper.Get("KEYCLOAK_AUTH_CLIENT_SECRET")
	if keycloakAuthClientSecret == nil {
		return fmt.Errorf("missing env variable KEYCLOAK_AUTH_CLIENT_SECRET")
	}
	config.Keycloak.AuthClient.Secret = keycloakAuthClientSecret.(string)

	navarcosCa := viper.Get("NAVARCOS_CA")
	if navarcosCa == nil {
		return fmt.Errorf("missing env variable NAVARCOS_CA")
	}
	config.NavarcosCa = navarcosCa.(string)

	kubeconfig := viper.Get("MANAGEMENT_CLUSTER_KUBECONFIG")
	if kubeconfig == nil {
		config.ManagementCluster.Kubeconfig = ""
	} else {
		config.ManagementCluster.Kubeconfig = kubeconfig.(string)
	}

	allowOrigins := viper.Get("SERVER_CORS_ALLOW_ORIGIN")
	if allowOrigins == nil {
		return fmt.Errorf("missing env variable SERVER_CORS_ALLOW_ORIGIN")
	}
	originsArray := strings.Split(allowOrigins.(string), ",")
	config.Server.Cors.AllowOrigin = originsArray

	chartRepo := viper.Get("HELM_REPO_URL")
	if chartRepo == nil {
		return fmt.Errorf("missing env variable HELM_REPO_URL")
	}
	config.HelmRepoUrl = chartRepo.(string)
	return nil
}

func initDefaultValues() *Config {
	return &Config{
		ServiceName: "plancia",
		Server: Server{
			Port: 8080,
			Timeouts: Timeouts{
				Read:     10,
				Write:    10,
				Shutdown: 5,
				Headers:  10,
				Idle:     3600,
			},
			Cors: Cors{
				AllowCredentials: true,
				MaxAge:           3600,
				AllowHeaders:     []string{"Accept", "Authorization", "Content-Type"},
				AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
				ExposeHeaders:    []string{"Authorization"},
			},
		},
		ManagementCluster: ManagementCluster{
			CreationTimeout: 1,
		},
		Logger: Logger{},
		Keycloak: Keycloak{
			ClientTimeout: 5,
		},
	}
}
