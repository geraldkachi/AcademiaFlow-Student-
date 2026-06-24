import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.academiaflow.com/api/v1';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  timeout: 30000,
});

// Attach token on every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('af_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle auth errors globally
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('af_token');
      localStorage.removeItem('af_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default apiClient;
