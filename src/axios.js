// src/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api', // Ajusta si tu backend está en otro puerto o ruta
  headers: {
    'Content-Type': 'application/json',
  },
});

// Puedes agregar un interceptor para añadir el token JWT automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
