// server/routes/paymentRoutes.js
import express from "express";
import PaymentController from "../controllers/PaymentController.js";
// import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// router.use(authMiddleware.protect);

// Create PaymentIntent + persist payment record
router.post("/", PaymentController.createPayment);

// Read payment by id
router.get("/:paymentId", PaymentController.getPayment);

// Create refund (full or partial)
router.post("/:paymentId/refund", PaymentController.refundPayment);

// Stripe webhook (must use raw body)
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  PaymentController.handleStripeWebhook
);

export default router;
