// ─── Auth Service ─────────────────────────────────────────────────────────────
// All API interactions are isolated here. Swap the implementation
// (REST, Firebase, Supabase, etc.) without touching any UI component.

import type { LoginRequest, LoginResponse } from "@/types/auth";

// Base URL is read from env — never hardcoded
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

// ── Email / Password ──────────────────────────────────────────────────────────

export const loginWithEmail = async (
  data: LoginRequest
): Promise<LoginResponse> => {
  // TODO: Replace with real fetch once backend is ready
  // Example REST call:
  //
  // const res = await fetch(`${API_BASE}/auth/login`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(data),
  // });
  // if (!res.ok) {
  //   const error = await res.json();
  //   throw new Error(error.message ?? "Login failed");
  // }
  // return res.json();

  // ── Placeholder (remove when backend is integrated) ──────────────────────
  await new Promise((resolve) => setTimeout(resolve, 1200));

  if (data.email === "error@test.com") {
    throw new Error("Invalid email or password.");
  }

  return {
    token: "mock.jwt.token",
    refreshToken: "mock.refresh.token",
    expiresAt: Date.now() + 3600 * 1000,
    user: {
      id: "usr_01",
      email: data.email,
      name: "Demo User",
    },
  };
};

// ── OAuth — Google ────────────────────────────────────────────────────────────

export const loginWithGoogle = async (): Promise<void> => {
  // TODO: Implement Google OAuth flow
  // Options:
  //   • next-auth  → signIn("google")
  //   • Firebase   → signInWithPopup(auth, new GoogleAuthProvider())
  //   • Custom     → window.location.href = `${API_BASE}/auth/google`

  await new Promise((resolve) => setTimeout(resolve, 800));
  // Placeholder — no-op until OAuth is configured
};

// ── Token Helpers (ready for JWT integration) ─────────────────────────────────

export const storeTokens = (token: string, refreshToken: string): void => {
  // TODO: Store securely (httpOnly cookies via server action preferred over localStorage)
  // Example cookie approach:
  //   document.cookie = `auth_token=${token}; Secure; SameSite=Strict; Path=/`;
  void token;
  void refreshToken;
};

export const clearTokens = (): void => {
  // TODO: Clear auth cookies / storage
};