import UserModel from "../models/UserModel.js";
import hashUtils from "../utils/hashUtils.js";
import jwtUtils from "../utils/jwtUtils.js";

const userService = {
  async register({ username, email, password }) {
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      throw new Error("Email is already registered");
    }

    const hashedPassword = await hashUtils.hash(password);
    const newUser = await UserModel.create({ username, email, password: hashedPassword });

    return newUser;
  },

  async findByUsername(username) {
    return UserModel.findByUsername(username);
  },

  async findById(id) {
    return UserModel.findById(id);
  },

  async verifyPassword(user, password) {
    return hashUtils.compare(password, user.password);
  },

  generateToken(user) {
    return jwtUtils.sign({
      id: user.id,
      username: user.username,
      email: user.email,
    });
  },

  async findOrCreateGoogleUser({ googleId, email, username }) {
    let user = await UserModel.findByGoogleId(googleId);

    if (!user) {
      user = await UserModel.create({ username, email, googleId, password: null });
    }

    return user;
  },
};

export default userService;
