package middleware

import (
	"strings"

	"github.com/gin-gonic/gin"

	"github.com/anwitac246/sandboxed-code-editor-codecraft/backend/internal/service"
	apperrors "github.com/anwitac246/sandboxed-code-editor-codecraft/backend/pkg/errors"
	"github.com/anwitac246/sandboxed-code-editor-codecraft/backend/pkg/utils"
)

func Auth(authSvc *service.AuthService) gin.HandlerFunc {
	return func(c *gin.Context) {
		header := c.GetHeader("Authorization")
		if !strings.HasPrefix(header, "Bearer ") {
			utils.Fail(c, apperrors.ErrUnauthorized)
			return
		}

		claims, err := authSvc.ParseAccessToken(strings.TrimPrefix(header, "Bearer "))
		if err != nil {
			utils.Fail(c, apperrors.ErrInvalidToken)
			return
		}

		c.Set("claims", map[string]any(claims))
		c.Set("user_id", claims["sub"])
		c.Next()
	}
}
