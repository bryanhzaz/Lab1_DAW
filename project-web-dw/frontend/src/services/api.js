// frontend/src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000'
});

export function setToken(token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export function fetchVentas({ categoria, from, to }) {
  const params = {};
  if (categoria) params.categoria = categoria;
  if (from)      params.from      = from;
  if (to)        params.to        = to;
  return api.get('/data', { params });
}

export function fetchMetrics() {
  return api.get('/metrics');
}

export function fetchOrdenes() {
  return api.get('/dw/ordenes');
}

export default api;
