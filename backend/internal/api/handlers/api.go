package handlers

import (
	"github.com/gin-gonic/gin"

	"github.com/anwitac246/sandboxed-code-editor-codecraft/backend/internal/domain/models"
	"github.com/anwitac246/sandboxed-code-editor-codecraft/backend/internal/service"
	apperrors "github.com/anwitac246/sandboxed-code-editor-codecraft/backend/pkg/errors"
	"github.com/anwitac246/sandboxed-code-editor-codecraft/backend/pkg/utils"
)

type AuthHandler struct {
	authSvc *service.AuthService
}

func NewAuthHandler(authSvc *service.AuthService) *AuthHandler {
	return &AuthHandler{authSvc: authSvc}
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req models.FirebaseTokenRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.Fail(c, apperrors.ErrBadRequest)
		return
	}

	if err := h.authSvc.VerifyCaptcha(c.Request.Context(), req.CaptchaToken); err != nil {
		if appErr, ok := err.(*apperrors.AppError); ok {
			utils.Fail(c, appErr)
			return
		}
		utils.Fail(c, apperrors.ErrCaptchaFailed)
		return
	}

	firebaseToken, err := h.authSvc.VerifyFirebaseToken(c.Request.Context(), req.IDToken)
	if err != nil {
		utils.Fail(c, apperrors.ErrFirebaseVerify)
		return
	}

	tokens, err := h.authSvc.IssueTokens(firebaseToken)
	if err != nil {
		utils.Fail(c, apperrors.ErrInternal)
		return
	}

	utils.OK(c, models.LoginResponse{
		User:   h.authSvc.ExtractUser(firebaseToken),
		Tokens: *tokens,
	})
}

func (h *AuthHandler) Refresh(c *gin.Context) {
	var body struct {
		RefreshToken string `json:"refresh_token" binding:"required"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		utils.Fail(c, apperrors.ErrBadRequest)
		return
	}

	claims, err := h.authSvc.ParseAccessToken(body.RefreshToken)
	if err != nil {
		utils.Fail(c, apperrors.ErrInvalidToken)
		return
	}

	if tokenType, _ := claims["type"].(string); tokenType != "refresh" {
		utils.Fail(c, apperrors.ErrInvalidToken)
		return
	}

	utils.FailMsg(c, 501, "re-issue via firebase id_token recommended")
}

func (h *AuthHandler) Me(c *gin.Context) {
	claims, exists := c.Get("claims")
	if !exists {
		utils.Fail(c, apperrors.ErrUnauthorized)
		return
	}

	mapClaims, ok := claims.(map[string]any)
	if !ok {
		utils.Fail(c, apperrors.ErrUnauthorized)
		return
	}

	utils.OK(c, gin.H{
		"id":       mapClaims["sub"],
		"email":    mapClaims["email"],
		"provider": mapClaims["provider"],
	})
}

func (h *AuthHandler) Logout(c *gin.Context) {
	utils.OK(c, gin.H{"message": "logged out"})
}
