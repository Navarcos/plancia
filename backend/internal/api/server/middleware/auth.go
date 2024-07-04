package middleware

import (
	"context"
	"fmt"
	"github.com/Nerzal/gocloak/v13"
	"github.com/activadigital/plancia/configs"
	"github.com/activadigital/plancia/configs/logger"
	"github.com/activadigital/plancia/internal/api/dtos"
	"github.com/activadigital/plancia/internal/api/server/httpjson"
	"go.uber.org/zap"
	"net/http"
	"strings"
)

type AuthMiddleware struct {
	keycloak *gocloak.GoCloak
}

func NewAuthMiddleware(keycloak *gocloak.GoCloak) *AuthMiddleware {
	return &AuthMiddleware{keycloak: keycloak}
}

func (am *AuthMiddleware) ValidateToken(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		realm := configs.Global().Keycloak.Realm
		userToken := r.Header.Get("Authorization")
		bearerToken := strings.Split(userToken, " ")
		if userToken == "" || len(bearerToken) != 2 || bearerToken[0] != "Bearer" {
			err := fmt.Errorf("missing or invalid token")
			logger.Error(r.Context(), "", zap.Error(err))
			pd := dtos.ProblemDetailsFromError(err, r, "Unauthorized", http.StatusUnauthorized)
			_ = httpjson.Encode(w, r, pd.Status, pd)
			return
		}
		token, _, err := am.keycloak.DecodeAccessToken(r.Context(), bearerToken[1], realm)
		if err != nil {
			pd := dtos.ProblemDetailsFromError(err, r, "Unauthorized", http.StatusUnauthorized)
			_ = httpjson.Encode(w, r, pd.Status, pd)
			return
		}
		newContext := context.WithValue(r.Context(), Token("token"), token)
		r = r.WithContext(newContext)
		next.ServeHTTP(w, r)
	})
}

type Token string
