import jwt from 'jsonwebtoken';
import config from '../config/index.js';

export const signAccessToken = payload => {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
};

export const signRefreshToken = payload => {
  return jwt.sign(payload, config.refreshTokenSecret, { expiresIn: '7d' });
};

export const verifyToken = (token, type = 'access') => {
  const secret = type === 'access' ? config.jwtSecret : config.refreshTokenSecret;
  return jwt.verify(token, secret);
};
