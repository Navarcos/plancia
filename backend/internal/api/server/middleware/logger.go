package middleware

import (
	"context"
	"github.com/activadigital/plancia/configs/logger"
	"github.com/google/uuid"
	"github.com/urfave/negroni"
	"go.uber.org/zap"
	"net/http"
	"time"
)

func Logger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		requestId := uuid.New().String()
		header := logger.RequestIdKey
		ctx := context.WithValue(r.Context(), header, requestId)
		r = r.WithContext(ctx)
		writer := negroni.NewResponseWriter(w)

		logger.Info(r.Context(),
			"http request",
			zap.String("Uri", r.RequestURI),
			zap.String("Method", r.Method),
			zap.String("from", r.Header.Get("X-Real-Ip")),
			zap.String("Agent", r.UserAgent()))

		next.ServeHTTP(writer, r)

		end := time.Since(start).String()

		logger.Info(r.Context(),
			"http request handled",
			zap.String("Uri", r.RequestURI),
			zap.String("Method", r.Method),
			zap.String("from", r.Header.Get("X-Real-Ip")),
			zap.String("Agent", r.UserAgent()),
			zap.String("duration", end),
			zap.Int("Status", writer.Status()))
	})
}
