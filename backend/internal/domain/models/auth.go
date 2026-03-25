package models

import "time"

type User struct {
	ID        string    `json:"id"`
	Email     string    `json:"email"`
	Name      string    `json:"name"`
	Provider  string    `json:"provider"`
	CreatedAt time.Time `json:"created_at"`
}

type AuthTokens struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	ExpiresAt    int64  `json:"expires_at"`
}

type LoginResponse struct {
	User   User       `json:"user"`
	Tokens AuthTokens `json:"tokens"`
}

type FirebaseTokenRequest struct {
	IDToken      string `json:"id_token"      binding:"required"`
	CaptchaToken string `json:"captcha_token"  binding:"required"`
}
