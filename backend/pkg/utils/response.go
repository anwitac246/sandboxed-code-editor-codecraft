package utils

import (
	"net/http"

	apperrors "github.com/anwitac246/sandboxed-code-editor-codecraft/backend/pkg/errors"
	"github.com/gin-gonic/gin"
)

func OK(c *gin.Context, data any) {
	c.JSON(http.StatusOK, gin.H{"data": data})
}

func Created(c *gin.Context, data any) {
	c.JSON(http.StatusCreated, gin.H{"data": data})
}

func Fail(c *gin.Context, err *apperrors.AppError) {
	c.AbortWithStatusJSON(err.Code, err)
}

func FailMsg(c *gin.Context, code int, message string) {
	c.AbortWithStatusJSON(code, gin.H{"message": message})
}
