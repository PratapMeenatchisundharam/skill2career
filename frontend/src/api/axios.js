import axios from 'axios';

// In production (e.g. Render), set VITE_API_BASE_URL to your deployed backend's URL + /api
// e.g. https://skill2career-backend.onrender.com/api
// In local dev, this falls back to '/api', which Vite proxies to http://localhost:5000
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api'
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('s2c_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
