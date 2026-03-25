package errors

import (
	"fmt"
	"net/http"
)

type AppError struct {
	Code    int    `json:"-"`
	Message string `json:"message"`
	Detail  string `json:"detail,omitempty"`
}

func (e *AppError) Error() string {
	return fmt.Sprintf("%d: %s", e.Code, e.Message)
}

func New(code int, message string) *AppError {
	return &AppError{Code: code, Message: message}
}

var (
	ErrUnauthorized   = New(http.StatusUnauthorized, "unauthorized")
	ErrInvalidToken   = New(http.StatusUnauthorized, "invalid or expired token")
	ErrCaptchaFailed  = New(http.StatusBadRequest, "captcha verification failed")
	ErrCaptchaScore   = New(http.StatusBadRequest, "captcha score too low — possible bot activity")
	ErrRateLimited    = New(http.StatusTooManyRequests, "too many requests — please slow down")
	ErrInternal       = New(http.StatusInternalServerError, "internal server error")
	ErrBadRequest     = New(http.StatusBadRequest, "bad request")
	ErrFirebaseVerify = New(http.StatusUnauthorized, "firebase token verification failed")
)
