import { create } from 'zustand';
import api from '../api';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('shiftsync_token') || null,
  isAuthenticated: !!localStorage.getItem('shiftsync_token'),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, accessToken } = response.data.data;
      
      localStorage.setItem('shiftsync_token', accessToken);
      set({ user, token: accessToken, isAuthenticated: true, isLoading: false });
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/register', data);
      const { user, accessToken } = response.data.data;
      
      localStorage.setItem('shiftsync_token', accessToken);
      set({ user, token: accessToken, isAuthenticated: true, isLoading: false });
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  sendInvite: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/invite/send', { email });
      set({ isLoading: false });
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Invitation failed';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('shiftsync_token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  checkSession: async () => {
    const token = localStorage.getItem('shiftsync_token');
    if (!token) return;

    try {
      // In a real app we might have a /auth/me endpoint
      // For now we'll assume the token is active if not expired
      // or implement a simple validation call if needed.
    } catch (err) {
      localStorage.removeItem('shiftsync_token');
      set({ user: null, token: null, isAuthenticated: false });
    }
  }
}));

