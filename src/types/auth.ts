export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  expiresAt: number; // Unix timestamp
  user: AuthUser;
}

export interface AuthError {
  code: string;
  message: string;
  field?: keyof LoginRequest;
}

export interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}