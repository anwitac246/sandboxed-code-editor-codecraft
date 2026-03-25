package database

import (
	"context"

	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/auth"

	"github.com/anwitac246/sandboxed-code-editor-codecraft/backend/internal/config"
)

type FirebaseClient struct {
	Auth *auth.Client
}

func NewFirebaseClient(ctx context.Context, cfg *config.FirebaseConfig) (*FirebaseClient, error) {
	app, err := firebase.NewApp(ctx, nil)
	if err != nil {
		return nil, err
	}

	authClient, err := app.Auth(ctx)
	if err != nil {
		return nil, err
	}

	return &FirebaseClient{Auth: authClient}, nil
}
