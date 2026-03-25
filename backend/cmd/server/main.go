package main

import (
	"context"
	"errors"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"

	"github.com/anwitac246/sandboxed-code-editor-codecraft/backend/internal/api"
	"github.com/anwitac246/sandboxed-code-editor-codecraft/backend/internal/config"
	"github.com/anwitac246/sandboxed-code-editor-codecraft/backend/internal/database"
	"github.com/anwitac246/sandboxed-code-editor-codecraft/backend/internal/service"
	"github.com/anwitac246/sandboxed-code-editor-codecraft/backend/pkg/logger"
)

func main() {
	cfg, err := config.Load("./configs/config.yaml")
	if err != nil {
		panic("failed to load config: " + err.Error())
	}

	if err := logger.Init(cfg.Server.Env); err != nil {
		panic("failed to init logger: " + err.Error())
	}
	defer logger.Sync()

	if cfg.Server.Env == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	ctx := context.Background()

	fbClient, err := database.NewFirebaseClient(ctx, &cfg.Firebase)
	if err != nil {
		logger.Fatal("firebase init failed", zap.Error(err))
		os.Exit(1)
	}

	rdb, err := database.NewRedisClient(&cfg.Redis)
	if err != nil {
		logger.Fatal("redis init failed", zap.Error(err))
		os.Exit(1)
	}

	authSvc := service.NewAuthService(fbClient, cfg)

	r := gin.New()
	r.Use(gin.Recovery())
	api.RegisterRoutes(r, authSvc, rdb, cfg)

	srv := &http.Server{
		Addr:         ":" + cfg.Server.Port,
		Handler:      r,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	go func() {
		logger.Info("server starting on :" + cfg.Server.Port)
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			logger.Fatal("server error", zap.Error(err))
			os.Exit(1)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	logger.Info("shutting down...")
	shutdownCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()
	_ = srv.Shutdown(shutdownCtx)
}
