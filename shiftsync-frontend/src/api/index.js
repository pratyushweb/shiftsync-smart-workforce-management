import axios from 'axios';

const api = axios.create({
  baseURL: '/api',

  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('shiftsync_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle common errors (like 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Potentially redirect to login or refresh token
      console.error('Session expired. Redirecting...');
      localStorage.removeItem('shiftsync_token');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
