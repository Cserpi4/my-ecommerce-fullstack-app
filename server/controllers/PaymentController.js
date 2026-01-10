// server/controllers/PaymentController.js
import paymentService from "../services/paymentService.js";
import Stripe from "stripe";
import config from "../config/index.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || config.stripeSecretKey, {
  apiVersion: "2024-06-20",
});

const PaymentController = {
  async createPayment(req, res, next) {
    try {
      const { orderId = null, amount, currency = "usd" } = req.body;

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        automatic_payment_methods: { enabled: true },
      });

      const result = await paymentService.createPayment({
        orderId,
        amount,
        currency,
      });

      res.status(201).json({
        success: true,
        payment: {
          ...result,
          client_secret: paymentIntent.client_secret,
        },
      });
    } catch (err) {
      console.error("❌ createPayment error:", err.message);
      res.status(500).json({
        success: false,
        message: "Payment creation failed.",
        error: err.message,
      });
    }
  },

  async getPayment(req, res, next) {
    try {
      const { paymentId } = req.params;
      const payment = await paymentService.getPaymentById(paymentId);

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: "Payment not found",
        });
      }

      res.json({
        success: true,
        payment,
      });
    } catch (err) {
      console.error("❌ getPayment error:", err.message);
      next(err);
    }
  },

  async handleStripeWebhook(req, res) {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("❌ Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      await paymentService.updatePaymentStatus(paymentIntent.id, "succeeded");
      console.log("✅ Payment succeeded:", paymentIntent.id);
    }

    if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object;
      await paymentService.updatePaymentStatus(paymentIntent.id, "failed");
      console.warn("⚠️ Payment failed:", paymentIntent.id);
    }

    res.json({ received: true });
  },
};

export default PaymentController;
