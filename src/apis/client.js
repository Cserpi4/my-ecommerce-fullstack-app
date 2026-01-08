// src/apis/client.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // 🔥 szükséges, hogy a CSRF cookie és session működjön
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Auth token kezelés ---
client.interceptors.request.use(
  req => {
    const token = localStorage.getItem('accessToken');
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
  },
  error => Promise.reject(error)
);

// --- CSRF token interceptor ---
let csrfToken = null;

client.interceptors.request.use(
  async config => {
    // Ha POST, PUT, PATCH, DELETE kérés → kérjük le a CSRF tokent, ha nincs
    if (['post', 'put', 'patch', 'delete'].includes(config.method) && !csrfToken) {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/csrf-token`, {
          withCredentials: true,
        });
        csrfToken = data.csrfToken;
      } catch (err) {
        console.warn('⚠️ Failed to fetch CSRF token:', err.message);
      }
    }

    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }

    return config;
  },
  error => Promise.reject(error)
);

// --- Manuális init (opcionális) ---
export const initCsrf = async () => {
  try {
    const { data } = await client.get('/csrf-token');
    csrfToken = data.csrfToken;
    console.log('✅ CSRF token initialized');
  } catch (err) {
    console.error('❌ Failed to init CSRF token:', err.message);
  }
};

export default client;
