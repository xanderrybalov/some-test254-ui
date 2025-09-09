export interface User {
  id: string;
  username: string;
  email?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresIn: string;
}

export interface LoginRequest {
  login: string; // username or email
  password: string;
}

export interface RegisterRequest {
  username: string;
  email?: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface TokenVerifyResponse {
  valid: boolean;
  user?: User;
  error?: string;
}
