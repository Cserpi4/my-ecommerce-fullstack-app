import express from "express";
import passport from "passport";
import AuthController from "../controllers/AuthController.js";

const router = express.Router();

// Register
router.post("/register", AuthController.register);

// Login
router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  AuthController.login
);

export default router;
