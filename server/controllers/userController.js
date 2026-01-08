// server/controllers/userController.js
import UserService from '../services/userService.js';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';

// POST /api/users/register
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await UserService.createUser({ username, email, password });
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// POST /api/users/login
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await UserService.loginUser(username, password);
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    res.json({ success: true, token, user });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// GET /api/users/profile
export const getProfile = async (req, res) => {
  try {
    const user = await UserService.findById(req.user.id);
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
};
