package client

import (
	"github.com/activadigital/plancia/configs/logger"
	"github.com/activadigital/plancia/internal/domain/apperror"
	"go.uber.org/zap"
	"k8s.io/client-go/rest"
	"net/http"
	"time"
)

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

func Instrument(config *rest.Config) error {
	transportFor, err := rest.TransportFor(config)
	if err != nil {
		return apperror.NewInternalError(err)
	}
	roundTripper := NewLogger(transportFor)
	config.Transport = roundTripper
	config.TLSClientConfig = rest.TLSClientConfig{}
	return nil
}
