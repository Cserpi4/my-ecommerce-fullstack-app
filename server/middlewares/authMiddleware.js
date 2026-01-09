import jwt from 'jsonwebtoken';
import config from '../config/index.js';

// Kötelező JWT
const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, token missing' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Not authorized, token invalid' });
  }
};

// Admin only
const protectAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ success: false, message: 'Forbidden, admin only' });
  }
  next();
};

// ✅ OPTIONAL JWT (cart-hoz)
const optionalProtect = (req, res, next) => {
  const header = req.headers.authorization;

  if (header && header.startsWith('Bearer')) {
    try {
      const token = header.split(' ')[1];
      const decoded = jwt.verify(token, config.jwtSecret);
      req.user = decoded;
    } catch (err) {
      req.user = null; // rossz token → anonként megy tovább
    }
  }

  next();
};

export default { protect, protectAdmin, optionalProtect };
