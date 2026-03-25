# &lt;img src="https://raw.githubusercontent.com/anwitac246/sandboxed-code-editor-codecraft/main/public/window.svg" width="30"&gt; CodeCraft: Sandboxed Code Editor

CodeCraft is a modern, web-based code editor that provides a secure, sandboxed environment for executing code. It features a robust authentication system and a scalable backend architecture, designed to deliver a seamless and secure developer experience.

## ✨ Tech Stack

The project is a full-stack application built with a modern technology set for both the frontend and backend.

### Frontend (Next.js)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

### Backend (Go)
![Go](https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white)
![Gin](https://img.shields.io/badge/Gin-0077B5?style=for-the-badge&logo=gin&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

---

##  Folder Structure (Frontend)

The frontend is a Next.js application located in the `src` directory, following the App Router paradigm.

```
/
├── src/
│   ├── app/                # Next.js App Router pages and layouts
│   │   ├── login/          # Login page
│   │   └── users/          # User-specific pages (e.g., projects)
│   ├── components/         # Reusable React components (UI, layout, features)
│   ├── hooks/              # Custom React hooks (e.g., useAuth)
│   ├── lib/                # Core libraries and client-side config (Firebase, tokens)
│   └── service/            # Frontend services for API communication (auth.service.ts)
├── public/                 # Static assets (images, SVGs)
└── backend/                # Go backend service (see backend/README.md)
```

## Key Logic & Features

### Authentication Flow

User authentication is handled through a hybrid approach that leverages Firebase for identity management and a custom backend for session control.

1.  **Client-Side (Firebase)**: Users sign in or sign up using email/password or Google Sign-In via the Firebase Authentication client-side SDK.
2.  **Token Exchange**: Upon a successful Firebase login, the frontend receives a Firebase ID Token. This token, along with a reCAPTCHA token, is sent to our Go backend.
3.  **Backend Verification**: The backend verifies both the reCAPTCHA token and the Firebase ID Token.
4.  **Session Creation (JWT)**: If verification is successful, the backend generates its own session using a signed JWT (Access and Refresh tokens) and sends it back to the client.
5.  **Authenticated Requests**: The frontend stores these JWTs and uses them to make authenticated requests to the backend for user-specific data and actions.

### reCAPTCHA v3 Integration

To prevent automated abuse and bot sign-ups, Google reCAPTCHA v3 is implemented on the login and registration flows.

-   **Why?**: reCAPTCHA v3 works invisibly in the background, analyzing user behavior to return a score. This provides a frictionless user experience, unlike v2 which often requires users to solve challenges.
-   **Implementation**: The frontend generates a token for each login/signup action. The backend verifies this token with Google, including the user's IP address, and checks if the score is above a predefined threshold. Requests with low scores are rejected, effectively blocking most bot traffic.

## Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Set up environment variables**: Create a `.env` file in the root and add the necessary Firebase and reCAPTCHA public keys.
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:8080
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
    # ... other Firebase config ...
    ```
3.  **Run the development server**:
    ```bash
    npm run dev
    ```
This will start the frontend application, typically on `http://localhost:3000`.