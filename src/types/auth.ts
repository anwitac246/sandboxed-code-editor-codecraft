export interface LoginRequest {
  email:    string;
  password: string;
}

export interface AuthUser {
  id:        string;
  email:     string;
  name:      string;
  provider?: string;
}

export interface AuthTokens {
  access_token:  string;
  refresh_token: string;
  expires_at:    number;
}

// LoginResponse matches the backend envelope AND preserves the flat token
// fields your existing useAuth hook reads (token / refreshToken).
export interface LoginResponse {
  user:         AuthUser;
  tokens:       AuthTokens;
  // Flat aliases kept for backwards-compat with existing useAuth
  token:        string;
  refreshToken: string;
  expiresAt:    number;
}

export interface FormErrors {
  email?:    string;
  password?: string;
  general?:  string;
}