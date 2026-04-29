import api from '@/shared/api/api-client';
import type { AuthResponse, LoginCredentials, RegisterCredentials, User } from '../types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/login', credentials);
    if (response.data.access_token) {
      localStorage.setItem('auth_token', response.data.access_token);
    }
    return response.data;
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/register', credentials);
    if (response.data.access_token) {
      localStorage.setItem('auth_token', response.data.access_token);
    }
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/logout');
    } finally {
      localStorage.removeItem('auth_token');
    }
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/user');
    return response.data;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  },

  updateActivity(): void {
    if (this.isAuthenticated()) {
      localStorage.setItem('last_activity', Date.now().toString());
    }
  },

  checkSessionTimeout(): void {
    const lastActivity = localStorage.getItem('last_activity');
    const token = localStorage.getItem('auth_token');
    
    if (token && lastActivity) {
      const thirtyMinutes = 30 * 60 * 1000;
      if (Date.now() - parseInt(lastActivity) > thirtyMinutes) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('last_activity');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    } else if (token && !lastActivity) {
      // Si token présent mais pas de timestamp (premier passage au nouveau système)
      this.updateActivity();
    }
  }
};
