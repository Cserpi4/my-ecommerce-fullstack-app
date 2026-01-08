import client from './client.js';

// === REGISTER ===
export const registerUser = async userData => {
  const { data } = await client.post('/users/register', userData);
  return data;
};

// === LOGIN ===
export const loginUser = async credentials => {
  const { data } = await client.post('/users/login', credentials);
  return data;
};

// === LOGOUT ===
export const logoutUser = async () => {
  const { data } = await client.post('/users/logout');
  return data;
};

// === USER PROFILE ===
export const fetchUserProfile = async () => {
  const { data } = await client.get('/users/profile');
  return data;
};

export const updateUserProfile = async userData => {
  const { data } = await client.put('/users/profile', userData);
  return data;
};

// === FORGOT PASSWORD ===
export const forgotPassword = async email => {
  const { data } = await client.post('/users/forgot-password', { email });
  return data; // pl. { message: "Password reset link sent" }
};

// === RESET PASSWORD ===
export const resetPassword = async (token, password) => {
  const { data } = await client.post(`/users/reset-password/${token}`, { password });
  return data; // pl. { message: "Password successfully reset" }
};
