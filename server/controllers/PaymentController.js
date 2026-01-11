// server/controllers/PaymentController.js
import paymentService from "../services/paymentService.js";
import cartService from "../services/cartService.js";

const toIntOrNull = (v) => {
  const n = Number(v);
  return Number.isInteger(n) && n > 0 ? n : null;
};

const PaymentController = {
  async createPayment(req, res) {
    try {
      const body = req.body ?? {};
      const orderId = body.orderId ?? null;
      const currency = body.currency ?? "usd";

      const userId = req.user?.id ?? null;

      // header-first cartId (anon)
      const headerCartId = toIntOrNull(req.get("x-cart-id"));
      const sessionCartId = toIntOrNull(req.session?.cartId);
      const anonCartId = headerCartId ?? sessionCartId;

      const userCart = userId ? await cartService.getOrCreateCartByUserId(userId) : null;
      const userCartId = userCart?.id ?? null;

      // header felülírja a sessiont
      if (!userId && req.session && headerCartId && req.session.cartId !== headerCartId) {
        req.session.cartId = headerCartId;
      }

      if (userId && anonCartId && userCartId && anonCartId !== userCartId) {
        await cartService.mergeCarts(anonCartId, userCartId);
        if (req.session) {
          req.session.cartId = userCartId;
        }
      }

      const result = await paymentService.createPayment({
        userId,
        cartId: anonCartId ?? userCartId,
        orderId,
        currency,
      });

      // anon: szinkron vissza a sessionbe
      if (!userId && req.session && result.cartId) {
        req.session.cartId = result.cartId;
      }

      return res.status(201).json({
        success: true,
        payment: {
          ...result.payment,
          client_secret: result.clientSecret,
        },
        cartId: result.cartId,
        amount: result.amount,
      });
    } catch (err) {
      const status = err.statusCode || 500;
      console.error("❌ createPayment error:", err);
      return res.status(status).json({
        success: false,
        message: "Payment creation failed.",
        error: err.message,
      });
    }
  },

  async getPayment(req, res) {
    try {
      const { paymentId } = req.params;
      const payment = await paymentService.getPaymentById(paymentId);

      if (!payment) {
        return res.status(404).json({ success: false, message: "Payment not found" });
      }

      return res.json({ success: true, payment });
    } catch (err) {
      console.error("❌ getPayment error:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch payment.",
        error: err.message,
      });
    }
  },

  async refundPayment(req, res) {
    try {
      const { paymentId } = req.params;
      const { amount = null, reason = null } = req.body ?? {};

      const payment = await paymentService.getPaymentById(paymentId);
      if (!payment?.payment_intent_id) {
        return res.status(404).json({ success: false, message: "Payment not found" });
      }

      const refund = await paymentService.refundPayment({
        paymentIntentId: payment.payment_intent_id,
        amount,
        reason,
      });

      return res.status(202).json({
        success: true,
        refund,
        status: "refund_pending",
      });
    } catch (err) {
      const status = err.statusCode || 500;
      return res.status(status).json({
        success: false,
        message: "Refund failed.",
        error: err.message,
      });
    }
  },

  async handleStripeWebhook(req, res) {
    try {
      const signature = req.headers["stripe-signature"];
      await paymentService.handleStripeWebhook({ rawBody: req.body, signature });
      return res.json({ received: true });
    } catch (err) {
      console.error("❌ Webhook error:", err);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  },
};

export default PaymentController;
