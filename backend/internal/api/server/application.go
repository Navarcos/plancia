package server

import (
	"context"
	"errors"
	"github.com/Nerzal/gocloak/v13"
	"github.com/activadigital/plancia/configs"
	"github.com/activadigital/plancia/configs/logger"
	"github.com/activadigital/plancia/internal/domain/skafos/client"
	"github.com/activadigital/plancia/internal/usecase/skafos"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"go.uber.org/zap"
	"net/http"
	"strconv"
)

type Application struct {
	router          *mux.Router
	skafosCreator   skafos.Creator
	skafosGetter    skafos.Getter
	skafosPatcher   skafos.Patcher
	skafosDeleter   skafos.Cleaner
	clusterImporter skafos.ClusterImporter
	registry        client.SkafosRegistry
}

func NewApplication(creator skafos.Creator, clusterGetter skafos.Getter, clusterPatcher skafos.Patcher,
	skafosDeleter skafos.Cleaner, registry client.SkafosRegistry,
	gocloakClient *gocloak.GoCloak, clusterImporter skafos.ClusterImporter) *Application {
	srv := &Application{
		router:          mux.NewRouter(),
		skafosCreator:   creator,
		skafosGetter:    clusterGetter,
		skafosPatcher:   clusterPatcher,
		skafosDeleter:   skafosDeleter,
		registry:        registry,
		clusterImporter: clusterImporter,
	}
	srv.setupRoutes(gocloakClient)
	return srv
}

func CORS(router *mux.Router) http.Handler {
	corsCfg := configs.Global().Server.Cors
	c := cors.New(
		cors.Options{
			AllowedOrigins:   corsCfg.AllowOrigin,
			AllowedMethods:   corsCfg.AllowMethods,
			AllowedHeaders:   corsCfg.AllowHeaders,
			ExposedHeaders:   corsCfg.ExposeHeaders,
			MaxAge:           corsCfg.MaxAge,
			AllowCredentials: corsCfg.AllowCredentials,
		},
	)
	return c.Handler(router)
}

func (s *Application) Run(ctx context.Context) *http.Server {
	srv := &http.Server{
		Addr:    ":" + strconv.Itoa(configs.Global().Server.Port),
		Handler: CORS(s.router),
		//ReadTimeout:       time.Duration(configs.Global().Server.Timeouts.Read) * time.Second,
		//ReadHeaderTimeout: time.Duration(configs.Global().Server.Timeouts.Headers) * time.Second,
		//WriteTimeout:      time.Duration(configs.Global().Server.Timeouts.Write) * time.Second,
		//IdleTimeout: time.Duration(configs.Global().Server.Timeouts.Idle) * time.Second,
	}

	go func() {
		logger.Info(ctx, "Start serving request", zap.String("addr", srv.Addr))
		if err := srv.ListenAndServe(); !errors.Is(err, http.ErrServerClosed) {
			logger.Error(ctx, "HTTP server crashed", zap.Error(err))
		}
	}()
	return srv
}
