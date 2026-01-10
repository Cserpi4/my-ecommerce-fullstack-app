import UserModel from "../models/UserModel.js";
import hashUtils from "../utils/hashUtils.js";
import jwtUtils from "../utils/jwtUtils.js";

const authService = {
  async register({ username, email, password }) {
    const hashedPassword = await hashUtils.hash(password);

    const user = await UserModel.create({
      username,
      email,
      password: hashedPassword,
    });

    return user;
  },

  async login({ email, password }) {
    const user = await UserModel.findByEmail(email);
    if (!user) throw new Error("User not found");

    const valid = await hashUtils.compare(password, user.password);
    if (!valid) throw new Error("Invalid password");

    const token = jwtUtils.sign({ id: user.id });

    return { user, token };
  },
};

export default authService;
