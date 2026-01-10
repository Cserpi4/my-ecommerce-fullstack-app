import jwt from 'jsonwebtoken';
import config from '../config/index.js';

const getBearerToken = (req) => {
  const header = req.headers.authorization;
  if (!header) return null;

  const [type, token] = header.split(' ');
  if (type !== 'Bearer' || !token) return null;

  return token;
};

const verifyToken = (token) => jwt.verify(token, config.jwtSecret);

const authMiddleware = {
  // Kötelező JWT
  protect(req, res, next) {
    const token = getBearerToken(req);

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized, token missing' });
    }

    try {
      req.user = verifyToken(token);
      return next();
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Not authorized, token invalid' });
    }
  },

  // Optional JWT (anon flow-hoz, pl. cart)
  optionalProtect(req, res, next) {
    const token = getBearerToken(req);

    if (!token) {
      req.user = null;
      return next();
    }

    try {
      req.user = verifyToken(token);
    } catch (err) {
      req.user = null;
    }

    return next();
  },

  // Admin only (protect után használd)
  protectAdmin(req, res, next) {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ success: false, message: 'Forbidden, admin only' });
    }
    return next();
  },
};

export default authMiddleware;
