import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import config from '../config/index.js';

const { jwtSecret, jwtExpiresIn } = config;

const authService = {
  async register({ username, email, password }) {
    const hashed = await bcrypt.hash(password, 10);
    const user = await userModel.create({ username, email, password: hashed });
    return user;
  },

  async login({ email, password }) {
    const user = await userModel.findByEmail(email);
    if (!user) throw new Error('User not found');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Invalid password');

    const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: jwtExpiresIn });
    return { user, token };
  },
};

export default authService;
