// src/utils/authHelpers.js

export const saveToken = token => {
  localStorage.setItem('accessToken', token);
};

export const getToken = () => localStorage.getItem('accessToken');

export const removeToken = () => localStorage.removeItem('accessToken');

export const isAuthenticated = () => !!getToken();
