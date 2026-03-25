# CodeCraft - Backend Service

This directory contains the backend service for the CodeCraft application. It is a Go-based API responsible for user authentication, session management, and other core business logic.

## Tech Stack

![Go](https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white)
![Gin](https://img.shields.io/badge/Gin-0077B5?style=for-the-badge&logo=gin&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Firebase Admin](https://img.shields.io/badge/Firebase_Admin-039BE5?style=for-the-badge&logo=firebase&logoColor=white)

---

## Folder Structure

The backend follows a standard Go project layout to maintain a clean and scalable architecture.

```
/backend/
├── cmd/
│   └── server/             # Main application entrypoint
├── internal/
│   ├── api/                # Gin handlers, routes, and middleware
│   ├── config/             # Configuration loading (from YAML)
│   ├── database/           # Database clients (Firebase, Redis)
│   ├── domain/             # Core domain models and types
│   └── service/            # Business logic (auth service)
├── pkg/                    # Shared packages (logger, errors, utils)
├── go.mod                  # Go module dependencies
└── configs/config.yaml     # Application configuration file
```

## Key Logic & Features

### Authentication & Session Management

The backend uses a two-step verification process to establish a secure user session.

1.  **Token Reception**: The `/api/v1/auth/login` endpoint accepts a **Firebase ID Token** and a **reCAPTCHA Token** from the client.
2.  **Captcha Verification**: It first validates the reCAPTCHA token with Google's API, including the user's IP for enhanced security. This is a critical step to block automated requests before they can consume system resources.
3.  **Firebase Token Verification**: If the captcha is valid, the Firebase ID Token is verified using the **Firebase Admin SDK**. This confirms the user's identity with the trusted Firebase service.
4.  **JWT Issuance**: Upon successful verification of both tokens, the service generates and signs a new pair of **JSON Web Tokens (JWTs)**:
    -   An **Access Token** (short-lived) for authorizing API requests.
    -   A **Refresh Token** (long-lived) for obtaining a new access token without requiring the user to log in again.
    This decouples the application's session from Firebase, allowing for independent session control and reducing reliance on external services for every request.

### Rate Limiting

To protect the API from brute-force attacks and denial-of-service attempts, a middleware-based rate limiting strategy is employed using **Redis**.

-   **Why Redis?**: Redis provides a fast, in-memory data store perfect for tracking request counts from different IP addresses. It ensures that rate limiting is efficient and can be scaled across multiple instances of the backend service if needed.
-   **Implementation**: A Gin middleware is applied to sensitive routes (e.g., `/auth/*`). It tracks the number of requests from a single IP address over a specific time window. If a client exceeds the limit, the API responds with a `429 Too Many Requests` error, temporarily blocking the client.

### Configuration Management

The application is configured through a `config.yaml` file and environment variables.

-   **`godotenv`**: The application uses `github.com/joho/godotenv` to load environment variables from a `.env` file during development. This is crucial for securely providing the `GOOGLE_APPLICATION_CREDENTIALS` path needed by the Firebase Admin SDK.
-   **YAML Configuration**: The `config.yaml` file stores non-sensitive configuration like server port, CORS origins, and JWT expiry times.

## Getting Started

1.  **Install Go dependencies**:
    ```bash
    cd backend
    go mod tidy
    ```
2.  **Set up environment variables**: Create a `.env` file in the project's root directory. It must contain the path to your Google Cloud service account key file.
    ```env
    # .env (in project root)
    GOOGLE_APPLICATION_CREDENTIALS=backend/configs/your-service-account-key.json
    ```
3.  **Run the server**:
    ```bash
    go run ./cmd/server/main.go
    ```
The backend server will start, typically on port `8080` as defined in `configs/config.yaml`.