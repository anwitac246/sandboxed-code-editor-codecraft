const ACCESS_KEY  = "auth_access";
const REFRESH_KEY = "auth_refresh";
const EXPIRY_KEY  = "auth_expiry";

export function storeTokens(accessToken: string, refreshToken: string, expiresAt?: number): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_KEY,  accessToken);
  localStorage.setItem(REFRESH_KEY, refreshToken);
  if (expiresAt !== undefined) localStorage.setItem(EXPIRY_KEY, String(expiresAt));
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  const token  = localStorage.getItem(ACCESS_KEY);
  const expiry = Number(localStorage.getItem(EXPIRY_KEY) ?? 0);
  if (!token || Date.now() > expiry) return null;
  return token;
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_KEY);
}

export function clearTokens(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(EXPIRY_KEY);
}

export function isTokenExpired(): boolean {
  const expiry = Number(localStorage.getItem(EXPIRY_KEY) ?? 0);
  return Date.now() > expiry;
}