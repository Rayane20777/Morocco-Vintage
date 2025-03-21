export interface Role {
  authority: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  roles: Role[];
}

export interface AuthState {
  token: string | null;
  username: string | null;
  roles: Role[];
  isAuthenticated: boolean;
  isAdmin: boolean;
  error: string | null;
  loading: boolean;
  initialized: boolean;
  user: any | null;
} 