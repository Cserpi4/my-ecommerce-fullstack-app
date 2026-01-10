// server/routes/paymentRoutes.js
import express from "express";
import PaymentController from "../controllers/PaymentController.js";
// import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// router.use(authMiddleware.protect);

router.post("/", PaymentController.createPayment);
router.get("/:paymentId", PaymentController.getPayment);

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  PaymentController.handleStripeWebhook
);

export default router;
