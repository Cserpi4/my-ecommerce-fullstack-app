// server/controllers/PaymentController.js  (kiegészítés)
import paymentService from "../services/paymentService.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

const PaymentController = {
  // ... a meglévő metódusaiddal együtt

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
