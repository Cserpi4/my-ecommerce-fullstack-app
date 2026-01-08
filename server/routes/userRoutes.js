import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import { registerUser, loginUser, getProfile } from '../controllers/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Local auth routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authMiddleware.protect, getProfile); // ← használjuk az objektumból

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.id, username: req.user.username, email: req.user.email },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );
    res.redirect(`${config.clientUrl}/auth?token=${token}`);
  }
);

export default router;
