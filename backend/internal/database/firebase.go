package database

import (
	"context"
	"fmt"

	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/auth"
	"google.golang.org/api/option"

	"github.com/anwitac246/sandboxed-code-editor-codecraft/backend/internal/config"
)

type FirebaseClient struct {
	Auth *auth.Client
}

func NewFirebaseClient(ctx context.Context, cfg *config.FirebaseConfig) (*FirebaseClient, error) {
	if cfg.CredentialsFile == "" {
		return nil, fmt.Errorf("firebase credentials file not provided")
	}

	opt := option.WithCredentialsFile(cfg.CredentialsFile)
	app, err := firebase.NewApp(ctx, &firebase.Config{
		ProjectID: cfg.ProjectID,
	}, opt)
	if err != nil {
		return nil, fmt.Errorf("error initializing firebase app: %w", err)
	}

	authClient, err := app.Auth(ctx)
	if err != nil {
		return nil, fmt.Errorf("error getting firebase auth client: %w", err)
	}

	return &FirebaseClient{Auth: authClient}, nil
}
