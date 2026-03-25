package api

import (
	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"

	"github.com/anwitac246/sandboxed-code-editor-codecraft/backend/internal/api/handlers"
	"github.com/anwitac246/sandboxed-code-editor-codecraft/backend/internal/api/middleware"
	"github.com/anwitac246/sandboxed-code-editor-codecraft/backend/internal/config"
	"github.com/anwitac246/sandboxed-code-editor-codecraft/backend/internal/service"
)

func RegisterRoutes(r *gin.Engine, authSvc *service.AuthService, rdb *redis.Client, cfg *config.Config) {
	r.Use(middleware.RequestLogger())
	r.Use(middleware.CORS(cfg.CORS.AllowedOrigins))

	authHandler := handlers.NewAuthHandler(authSvc)

	v1 := r.Group("/api/v1")

	auth := v1.Group("/auth")
	auth.Use(middleware.AuthRateLimit(rdb))
	{
		auth.POST("/login", authHandler.Login)
		auth.POST("/refresh", authHandler.Refresh)
		auth.POST("/logout", authHandler.Logout)
	}

	protected := v1.Group("/")
	protected.Use(middleware.Auth(authSvc))
	protected.Use(middleware.APIRateLimit(rdb))
	{
		protected.GET("/me", authHandler.Me)
	}

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})
}
