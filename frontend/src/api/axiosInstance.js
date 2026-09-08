import axios from 'axios';

const configuredApiUrl = import.meta.env.VITE_API_URL
  || import.meta.env.NEXT_PUBLIC_API_URL
  || globalThis.process?.env?.NEXT_PUBLIC_API_URL
  || 'http://localhost:5000/api';

const apiBaseUrl = configuredApiUrl.replace(/\/+$/, '').endsWith('/api')
  ? configuredApiUrl.replace(/\/+$/, '')
  : `${configuredApiUrl.replace(/\/+$/, '')}/api`;

const axiosInstance = axios.create({
  baseURL: apiBaseUrl
});

axiosInstance.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? window.localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;