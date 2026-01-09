// src/apis/client.js
import axios from 'axios';

const API_HOST = (process.env.REACT_APP_API_URL || 'http://localhost:3001').replace(/\/$/, '');

const client = axios.create({
  baseURL: `${API_HOST}/api`,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// ✅ Auth + CartId header
client.interceptors.request.use(req => {
  const token = localStorage.getItem('accessToken');
  if (token) req.headers.Authorization = `Bearer ${token}`;

  // 🔥 cart persist cookie nélkül: küldjük headerben
  const cartId = localStorage.getItem('cartId');
  if (cartId) req.headers['X-Cart-Id'] = cartId;

  return req;
});

let csrfToken = null;

// ✅ Cart + payments CSRF nélkül van nálatok -> ezeket kihagyjuk
const shouldSkipCsrf = (url = '') => url.startsWith('/cart') || url.startsWith('/payments');

// CSRF token only for mutating requests (kivéve cart/payments)
client.interceptors.request.use(async config => {
  const method = (config.method || '').toLowerCase();
  const url = config.url || '';

  if (shouldSkipCsrf(url)) return config;

  if (['post', 'put', 'patch', 'delete'].includes(method) && !csrfToken) {
    const { data } = await client.get('/csrf-token'); // -> /api/csrf-token
    csrfToken = data.csrfToken;
  }

  if (csrfToken) config.headers['X-CSRF-Token'] = csrfToken;
  return config;
});

// Optional manual init
export const initCsrf = async () => {
  const { data } = await client.get('/csrf-token'); // -> /api/csrf-token
  csrfToken = data.csrfToken;
};

export default client;
