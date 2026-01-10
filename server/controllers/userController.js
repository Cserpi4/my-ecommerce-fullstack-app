// server/controllers/UserController.js
import userService from "../services/userService.js";
import jwtUtils from "../utils/jwtUtils.js";

const UserController = {
  async registerUser(req, res) {
    try {
      const { username, email, password } = req.body;
      const user = await userService.createUser({ username, email, password });

      res.status(201).json({ success: true, data: user });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  },

  async loginUser(req, res) {
    try {
      const { username, password } = req.body;
      const user = await userService.loginUser(username, password);

      if (!user) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
      }

      const token = jwtUtils.sign({
        id: user.id,
        username: user.username,
        email: user.email,
      });

      res.json({ success: true, token, user });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  },

  async getProfile(req, res) {
    try {
      const user = await userService.findById(req.user.id);
      res.json({ success: true, data: user });
    } catch (err) {
      res.status(404).json({ success: false, error: err.message });
    }
  },
};

export default UserController;
