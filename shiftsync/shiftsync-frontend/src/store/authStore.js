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
      const mappedUser = { ...user, name: user.fullName || user.name };
      
      localStorage.setItem('shiftsync_token', accessToken);
      set({ user: mappedUser, token: accessToken, isAuthenticated: true, isLoading: false });
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
      set({ isLoading: false });
      return response.data;
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

    set({ isLoading: true });
    try {
      const response = await api.get('/auth/me');
      const user = response.data.data;
      const mappedUser = { ...user, name: user.fullName || user.name };
      set({ user: mappedUser, isAuthenticated: true, isLoading: false });
    } catch (err) {
      localStorage.removeItem('shiftsync_token');
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },

  updateProfile: async (profileData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put('/auth/profile', profileData);
      const user = response.data.data;
      const mappedUser = { ...user, name: user.fullName || user.name };
      set({ user: mappedUser, isLoading: false });
      return mappedUser;
    } catch (err) {
      const message = err.response?.data?.message || 'Profile update failed';
      set({ error: message, isLoading: false });
      throw err;
    }
  }
}));

