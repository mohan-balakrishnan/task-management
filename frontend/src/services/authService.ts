import api from './api';
import { LoginRequest, RegisterRequest, JwtResponse, User } from '../types/auth';

export const authService = {
  async login(credentials: LoginRequest): Promise<JwtResponse> {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  async register(userData: RegisterRequest): Promise<void> {
    await api.post('/auth/register', userData);
  },

  async refreshToken(): Promise<JwtResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await api.post('/auth/refresh', {}, {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get('/users/profile');
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  },

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  },

  setTokens(tokens: JwtResponse): void {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  },
};