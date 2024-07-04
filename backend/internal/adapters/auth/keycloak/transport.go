package keycloak

import (
	"encoding/json"
	"fmt"
	"github.com/activadigital/plancia/configs"
	"github.com/activadigital/plancia/configs/logger"
	"go.uber.org/zap"
	"net/http"
	"net/url"
	"strings"
	"time"
)

const (
	keycloakLogin = "/realms/%s/protocol/openid-connect/token"
)

type KeycloakAuth struct {
	next       http.RoundTripper
	httpClient *http.Client
}

type LoginResponse struct {
	AccessToken      string `json:"access_token"`
	ExpiresIn        int    `json:"expires_in"`
	RefreshExpiresIn int    `json:"refresh_expires_in"`
	TokenType        string `json:"token_type"`
	NotBeforePolicy  int    `json:"not-before-policy"`
	Scope            string `json:"scope"`
}

func NewKeycloakAuth(next http.RoundTripper, httpClient *http.Client) http.RoundTripper {
	return &KeycloakAuth{
		next:       next,
		httpClient: httpClient,
	}
}

func (a *KeycloakAuth) RoundTrip(r *http.Request) (*http.Response, error) {
	config := configs.Global().Keycloak
	requestUrl := config.Url + fmt.Sprintf(keycloakLogin, config.Realm)
	data := url.Values{}
	data.Set("grant_type", "client_credentials")
	data.Set("client_id", config.ServiceAccount.ClientId)
	data.Add("client_secret", config.ServiceAccount.Secret)

	encodedData := data.Encode()
	request, err := http.NewRequestWithContext(r.Context(), http.MethodPost, requestUrl, strings.NewReader(encodedData))
	if err != nil {
		logger.Error(r.Context(), "keycloakClient login: error creating request", zap.Error(err))
		return nil, err
	}
	request.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	resp, err := a.httpClient.Do(request)
	if err != nil {
		logger.Error(r.Context(), "error getting response", zap.Error(err))
		return nil, err
	}

	if resp.StatusCode != http.StatusOK {
		logger.Error(r.Context(), "keycloak login error", zap.String("status", resp.Status))
		return nil, err
	}

	loginResponse := &LoginResponse{}
	if err = json.NewDecoder(resp.Body).Decode(loginResponse); err != nil {
		logger.Error(r.Context(), "keycloakClient login: error decoding response body", zap.Error(err))
		return nil, err
	}

	token := loginResponse.AccessToken
	r.Header.Set("Authorization", "Bearer "+token)
	r.Header.Set("Content-Type", "application/json")
	_ = resp.Body.Close()
	return a.next.RoundTrip(r)
}

type Logger struct {
	next http.RoundTripper
}

func NewLogger(next http.RoundTripper) http.RoundTripper {
	return &Logger{
		next: next,
	}
}

func (a *Logger) RoundTrip(r *http.Request) (*http.Response, error) {
	start := time.Now()

	resp, err := a.next.RoundTrip(r)
	if err != nil {
		return nil, err
	}
	logger.Info(r.Context(),
		"Outgoing http request",
		zap.String("Url", r.URL.String()),
		zap.String("Method", r.Method),
		zap.String("duration", time.Since(start).String()),
		zap.Int("status", resp.StatusCode))
	return resp, err
}
