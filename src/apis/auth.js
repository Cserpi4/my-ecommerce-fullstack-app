import client from './client.js';

const login = async credentials => {
  const response = await client.post('/auth/login', credentials);
  return response.data;
};

const register = async userData => {
  const response = await client.post('/auth/register', userData);
  return response.data;
};

const logout = async () => {
  const response = await client.post('/auth/logout');
  return response.data;
};

export default { login, register, logout };
