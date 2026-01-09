// src/apis/client.js
import axios from 'axios';

const API_HOST = (process.env.REACT_APP_API_URL || 'http://localhost:3001').replace(/\/$/, '');

const client = axios.create({
  baseURL: `${API_HOST}/api`,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Auth header
client.interceptors.request.use(req => {
  const token = localStorage.getItem('accessToken');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

let csrfToken = null;

// CSRF token only for mutating requests
client.interceptors.request.use(async config => {
  if (['post', 'put', 'patch', 'delete'].includes(config.method) && !csrfToken) {
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
