package server

import (
	"context"
	"github.com/activadigital/plancia/configs/logger"
	"github.com/activadigital/plancia/internal/domain/skafos/manager"
	"go.uber.org/zap"
	"net/http"
	"os"
	"os/signal"
	"sync"
	"syscall"
	"time"
)

func Shutdown(ctx context.Context, timeout time.Duration, httpServer *http.Server, manager *manager.Manager) {
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM, syscall.SIGINT)
	<-sigChan

	var syncGroup sync.WaitGroup
	syncGroup.Add(1)
	go func() {
		defer syncGroup.Done()
		if err := httpServer.Shutdown(ctx); err != nil {
			logger.Error(ctx, "HTTP server graceful shutdown failed.", zap.Error(err))
		}
		logger.Info(ctx, "Shutting down HTTP/HTTPS server")
	}()

	syncGroup.Add(1)
	go func() {
		defer syncGroup.Done()
		_ = zap.L().Sync()
	}()

	waitTimeout(&syncGroup, timeout)
}

func waitTimeout(wg *sync.WaitGroup, timeout time.Duration) bool {
	c := make(chan struct{})
	go func(c chan struct{}) {
		defer close(c)
		wg.Wait()
	}(c)

	select {
	case <-c:
		return false // completed normally
	case <-time.After(timeout):
		return true // timed out
	}
}
