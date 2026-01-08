// server/services/userService.js
import UserModel from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';

const SALT_ROUNDS = 10;

const UserService = {
  // Új felhasználó regisztráció
  async register({ username, email, password }) {
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      throw new Error('Email is already registered');
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = await UserModel.create({ username, email, password: hashedPassword });
    return newUser;
  },

  // Felhasználó keresése username alapján
  async findByUsername(username) {
    return await UserModel.findByUsername(username);
  },

  // Felhasználó keresése ID alapján
  async findById(id) {
    return await UserModel.findById(id);
  },

  // Jelszó ellenőrzés
  async verifyPassword(user, password) {
    return await bcrypt.compare(password, user.password);
  },

  // JWT generálás
  generateToken(user) {
    return jwt.sign({ id: user.id, username: user.username, email: user.email }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    });
  },

  // Google OAuth: felhasználó keresése vagy létrehozása
  async findOrCreateGoogleUser({ googleId, email, username }) {
    let user = await UserModel.findByGoogleId(googleId);
    if (!user) {
      user = await UserModel.create({ username, email, googleId, password: null });
    }
    return user;
  },
};

export default UserService;
