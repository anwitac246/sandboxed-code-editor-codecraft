package service

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"time"

	"firebase.google.com/go/v4/auth"
	"github.com/golang-jwt/jwt/v5"

	"github.com/anwitac246/sandboxed-code-editor-codecraft/backend/internal/config"
	"github.com/anwitac246/sandboxed-code-editor-codecraft/backend/internal/database"
	"github.com/anwitac246/sandboxed-code-editor-codecraft/backend/internal/domain/models"
	apperrors "github.com/anwitac246/sandboxed-code-editor-codecraft/backend/pkg/errors"
)

type AuthService struct {
	firebase *database.FirebaseClient
	cfg      *config.Config
}

func NewAuthService(fb *database.FirebaseClient, cfg *config.Config) *AuthService {
	return &AuthService{firebase: fb, cfg: cfg}
}

type captchaResponse struct {
	Success    bool     `json:"success"`
	Score      float64  `json:"score"`
	Action     string   `json:"action"`
	ErrorCodes []string `json:"error-codes"`
}

func (s *AuthService) VerifyCaptcha(ctx context.Context, token string) error {
	resp, err := http.PostForm(s.cfg.Captcha.VerifyURL, url.Values{
		"secret":   {s.cfg.Captcha.SecretKey},
		"response": {token},
	})
	if err != nil {
		return apperrors.ErrCaptchaFailed
	}
	defer resp.Body.Close()

	var result captchaResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return apperrors.ErrCaptchaFailed
	}

	if !result.Success {
		return apperrors.ErrCaptchaFailed
	}
	if result.Score < s.cfg.Captcha.MinScore {
		return apperrors.ErrCaptchaScore
	}
	return nil
}

func (s *AuthService) VerifyFirebaseToken(ctx context.Context, idToken string) (*auth.Token, error) {
	token, err := s.firebase.Auth.VerifyIDToken(ctx, idToken)
	if err != nil {
		return nil, apperrors.ErrFirebaseVerify
	}
	return token, nil
}

func (s *AuthService) IssueTokens(firebaseToken *auth.Token) (*models.AuthTokens, error) {
	now := time.Now()
	expiry := now.Add(time.Duration(s.cfg.JWT.ExpiryMinutes) * time.Minute)

	claims := jwt.MapClaims{
		"sub":      firebaseToken.UID,
		"email":    firebaseToken.Claims["email"],
		"provider": firebaseToken.Firebase.SignInProvider,
		"iat":      now.Unix(),
		"exp":      expiry.Unix(),
	}

	accessToken, err := jwt.NewWithClaims(jwt.SigningMethodHS256, claims).
		SignedString([]byte(s.cfg.JWT.Secret))
	if err != nil {
		return nil, fmt.Errorf("signing access token: %w", err)
	}

	refreshExpiry := now.Add(time.Duration(s.cfg.JWT.RefreshDays) * 24 * time.Hour)
	refreshClaims := jwt.MapClaims{
		"sub":  firebaseToken.UID,
		"type": "refresh",
		"iat":  now.Unix(),
		"exp":  refreshExpiry.Unix(),
	}

	refreshToken, err := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims).
		SignedString([]byte(s.cfg.JWT.Secret))
	if err != nil {
		return nil, fmt.Errorf("signing refresh token: %w", err)
	}

	return &models.AuthTokens{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		ExpiresAt:    expiry.UnixMilli(),
	}, nil
}

func (s *AuthService) ParseAccessToken(tokenStr string) (jwt.MapClaims, error) {
	token, err := jwt.Parse(tokenStr, func(t *jwt.Token) (any, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
		}
		return []byte(s.cfg.JWT.Secret), nil
	})
	if err != nil || !token.Valid {
		return nil, apperrors.ErrInvalidToken
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return nil, apperrors.ErrInvalidToken
	}
	return claims, nil
}

func (s *AuthService) ExtractUser(firebaseToken *auth.Token) models.User {
	email, _ := firebaseToken.Claims["email"].(string)
	name, _ := firebaseToken.Claims["name"].(string)

	return models.User{
		ID:       firebaseToken.UID,
		Email:    email,
		Name:     name,
		Provider: firebaseToken.Firebase.SignInProvider,
	}
}
