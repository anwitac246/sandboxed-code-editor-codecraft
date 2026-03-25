import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  getIdToken,
  type User as FirebaseUser,
} from "firebase/auth";

import { firebaseAuth } from "@/lib/firebase-config";
import { getCaptchaToken } from "@/lib/recaptcha";
import { storeTokens, clearTokens } from "@/lib/tokens";
import type { LoginRequest, LoginResponse } from "@/types/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

type BackendLoginResponse = {
  user: LoginResponse["user"];
  tokens: LoginResponse["tokens"];
};

async function exchangeFirebaseToken(
  firebaseUser: FirebaseUser,
  captchaAction: string
): Promise<LoginResponse> {
  const [idToken, captchaToken] = await Promise.all([
    getIdToken(firebaseUser),
    getCaptchaToken(captchaAction),
  ]);

  const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_token: idToken, captcha_token: captchaToken }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Authentication failed" }));
    throw new Error(err.message ?? "Authentication failed");
  }

  const { data }: { data: BackendLoginResponse } = await res.json();

  // Normalise: expose flat aliases so existing useAuth callers keep working
  return {
    ...data,
    token:        data.tokens.access_token,
    refreshToken: data.tokens.refresh_token,
    expiresAt:    data.tokens.expires_at,
  };
}

export const loginWithEmail = async (req: LoginRequest): Promise<LoginResponse> => {
  const credential = await signInWithEmailAndPassword(
    firebaseAuth,
    req.email,
    req.password
  );
  const data = await exchangeFirebaseToken(credential.user, "email_login");
  storeTokens(data.tokens.access_token, data.tokens.refresh_token, data.tokens.expires_at);
  return data;
};

export const registerWithEmail = async (req: LoginRequest): Promise<LoginResponse> => {
  const credential = await createUserWithEmailAndPassword(
    firebaseAuth,
    req.email,
    req.password
  );
  const data = await exchangeFirebaseToken(credential.user, "email_register");
  storeTokens(data.tokens.access_token, data.tokens.refresh_token, data.tokens.expires_at);
  return data;
};

export const loginWithGoogle = async (): Promise<LoginResponse> => {
  const provider = new GoogleAuthProvider();
  provider.addScope("email");
  provider.addScope("profile");

  const credential = await signInWithPopup(firebaseAuth, provider);
  const data = await exchangeFirebaseToken(credential.user, "google_login");
  storeTokens(data.tokens.access_token, data.tokens.refresh_token, data.tokens.expires_at);
  return data;
};

export const logout = async (): Promise<void> => {
  await signOut(firebaseAuth);
  clearTokens();
};

export { storeTokens, clearTokens };