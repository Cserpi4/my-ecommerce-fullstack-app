import jwt from 'jsonwebtoken';
import config from '../config/index.js';

const jwtUtils = {
  signAccessToken(payload) {
    return jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    });
  },

  signRefreshToken(payload) {
    return jwt.sign(payload, config.refreshTokenSecret, {
      expiresIn: '7d',
    });
  },

  verify(token, type = 'access') {
    const secret =
      type === 'access' ? config.jwtSecret : config.refreshTokenSecret;

    return jwt.verify(token, secret);
  },
};

export default jwtUtils;
