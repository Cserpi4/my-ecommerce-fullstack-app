import express from 'express';
import passport from 'passport';
import AuthService from '../services/AuthService.js';

const router = express.Router();

// Register
router.post('/register', async (req, res, next) => {
  try {
    const user = await AuthService.register(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

// Login
router.post('/login', passport.authenticate('local'), async (req, res, next) => {
  try {
    const token = await AuthService.generateToken(req.user);
    res.json({ token });
  } catch (err) {
    next(err);
  }
});

export default router;
