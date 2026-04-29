import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false, 
});

// Intercepteur pour ajouter le token si présent
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    localStorage.setItem('last_activity', Date.now().toString());
  }
  return config;
});

// Intercepteur pour gérer les erreurs globales (ex: 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Rediriger vers login ou vider le storage si nécessaire
      localStorage.removeItem('auth_token');
    }
    return Promise.reject(error);
  }
);

export default api;
