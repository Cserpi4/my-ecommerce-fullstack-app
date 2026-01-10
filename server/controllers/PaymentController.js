// server/controllers/PaymentController.js
import paymentService from "../services/paymentService.js";
import Stripe from "stripe";
import config from "../config/index.js";
import cartService from "../services/cartService.js";
import CartItemModel from "../models/CartItemModel.js";

const toIntOrNull = (v) => {
  const n = Number(v);
  return Number.isInteger(n) && n > 0 ? n : null;
};

const computeTotalCents = (items) =>
  items.reduce((sum, it) => {
    const price = Number(it.unit_price ?? it.price ?? 0);
    const qty = Number(it.quantity ?? 0);
    return sum + Math.round(price * 100) * qty;
  }, 0);

const secretKey = process.env.STRIPE_SECRET_KEY || config.stripeSecretKey;
const stripe = new Stripe(secretKey, { apiVersion: "2024-06-20" });

const PaymentController = {
  async createPayment(req, res) {
    try {
      if (!secretKey) {
        return res.status(500).json({
          success: false,
          message: "Payment creation failed.",
          error: "Missing STRIPE_SECRET_KEY",
        });
      }

      const { orderId = null, currency = "usd" } = req.body;

      // USER -> user cart
      let cartId = null;

      if (req.user?.id) {
        const cart = await cartService.getOrCreateCartByUserId(req.user.id);
        cartId = cart?.id ?? null;
      } else {
        // ANON -> header-first cartId
        const headerCartId = toIntOrNull(req.get("x-cart-id"));
        const sessionCartId = toIntOrNull(req.session?.cartId);
        cartId = headerCartId ?? sessionCartId;

        // header felülírja a sessiont
        if (req.session && headerCartId && req.session.cartId !== headerCartId) {
          req.session.cartId = headerCartId;
        }
      }

      if (!cartId) {
        return res.status(400).json({
          success: false,
          message: "Payment creation failed.",
          error: "Missing cartId",
        });
      }

      const items = await CartItemModel.getByCartId(cartId);
      const amount = computeTotalCents(items);

      if (!amount || amount <= 0) {
        return res.status(400).json({
          success: false,
          message: "Payment creation failed.",
          error: "Cart is empty",
        });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        automatic_payment_methods: { enabled: true },
        metadata: {
          cartId: String(cartId),
          isAnonymous: req.user?.id ? "false" : "true",
          ...(req.user?.id ? { userId: String(req.user.id) } : {}),
          ...(orderId ? { orderId: String(orderId) } : {}),
        },
      });

      const result = await paymentService.createPayment({
        orderId,
        amount,
        currency,
      });

      return res.status(201).json({
        success: true,
        payment: {
          ...result,
          client_secret: paymentIntent.client_secret,
        },
        cartId,
        amount,
      });
    } catch (err) {
      console.error("❌ createPayment error:", err);
      return res.status(500).json({
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

      return res.json({
        success: true,
        payment,
      });
    } catch (err) {
      console.error("❌ getPayment error:", err.message);
      return next(err);
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

    return res.json({ received: true });
  },
};

export default PaymentController;
