export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  message?: string;
  user?: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
  password_confirmation: string;
}
