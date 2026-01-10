import express from "express";
import passport from "passport";
import UserController from "../controllers/UserController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Local auth
router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);
router.get("/profile", authMiddleware.protect, UserController.getProfile);

// Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  UserController.googleCallback
);

export default router;
