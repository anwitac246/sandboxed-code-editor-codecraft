package middleware

import (
	"context"
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"

	apperrors "github.com/anwitac246/sandboxed-code-editor-codecraft/backend/pkg/errors"
	"github.com/anwitac246/sandboxed-code-editor-codecraft/backend/pkg/utils"
)

type RateLimitConfig struct {
	Requests  int
	Window    time.Duration
	KeyPrefix string
}

func RateLimit(rdb *redis.Client, cfg RateLimitConfig) gin.HandlerFunc {
	return func(c *gin.Context) {
		key := fmt.Sprintf("rl:%s:%s", cfg.KeyPrefix, c.ClientIP())
		ctx := context.Background()

		count, err := rdb.Incr(ctx, key).Result()
		if err != nil {
			c.Next()
			return
		}
		if count == 1 {
			rdb.Expire(ctx, key, cfg.Window)
		}
		if int(count) > cfg.Requests {
			utils.Fail(c, apperrors.ErrRateLimited)
			return
		}

		remaining := cfg.Requests - int(count)
		if remaining < 0 {
			remaining = 0
		}
		c.Header("X-RateLimit-Limit", fmt.Sprintf("%d", cfg.Requests))
		c.Header("X-RateLimit-Remaining", fmt.Sprintf("%d", remaining))
		c.Next()
	}
}

func AuthRateLimit(rdb *redis.Client) gin.HandlerFunc {
	return RateLimit(rdb, RateLimitConfig{
		Requests:  10,
		Window:    15 * time.Minute,
		KeyPrefix: "auth",
	})
}

func APIRateLimit(rdb *redis.Client) gin.HandlerFunc {
	return RateLimit(rdb, RateLimitConfig{
		Requests:  100,
		Window:    time.Minute,
		KeyPrefix: "api",
	})
}
