// server/services/paymentService.js
import paymentProvider from "../utils/paymentProvider.js";
import cartService from "./cartService.js";
import CartItemModel from "../models/CartItemModel.js";
import PaymentModel from "../models/PaymentModel.js";

const computeTotalCents = (items) =>
  items.reduce((sum, it) => {
    const price = Number(it.unit_price ?? it.price ?? 0);
    const qty = Number(it.quantity ?? 0);
    return sum + Math.round(price * 100) * qty;
  }, 0);

const paymentService = {
  async createPayment({ userId = null, cartId = null, orderId = null, currency = "usd" }) {
    // Resolve cartId
    let resolvedCartId = cartId;

    if (userId) {
      const cart = await cartService.getOrCreateCartByUserId(userId);
      resolvedCartId = cart?.id ?? null;
    }

    if (!resolvedCartId) {
      throw new Error("Missing cartId");
    }

    // Amount from cart
    const items = await CartItemModel.getByCartId(resolvedCartId);
    const amount = computeTotalCents(items);

    if (!amount || amount <= 0) {
      const err = new Error("Cart is empty");
      err.statusCode = 400;
      throw err;
    }

    const idempotencyKey = [
      `cart:${resolvedCartId}`,
      `order:${orderId ?? "none"}`,
      `user:${userId ?? "anon"}`,
      `amount:${amount}`,
      `currency:${currency}`,
    ].join("|");

    // Stripe PaymentIntent
    const paymentIntent = await paymentProvider.createPaymentIntent({
      amount,
      currency,
      idempotencyKey,
      metadata: {
        cartId: String(resolvedCartId),
        isAnonymous: userId ? "false" : "true",
        ...(userId ? { userId: String(userId) } : {}),
        ...(orderId ? { orderId: String(orderId) } : {}),
      },
    });

    // DB record
    const paymentRecord = await PaymentModel.create({
      orderId,
      amount,
      currency,
      status: "pending",
      provider: "stripe",
      providerPaymentIntentId: paymentIntent.id,
    });

    return {
      cartId: resolvedCartId,
      amount,
      clientSecret: paymentIntent.client_secret,
      payment: paymentRecord,
      paymentIntentId: paymentIntent.id,
    };
  },

  async getPaymentById(paymentId) {
    return PaymentModel.getById(paymentId);
  },

  async updatePaymentStatus(paymentIntentId, status) {
    return PaymentModel.updateStatusByPaymentIntentId(paymentIntentId, status);
  },

  async refundPayment({ paymentIntentId, amount = null, reason = null }) {
    if (!paymentIntentId) throw new Error("Missing paymentIntentId");

    const payment = await PaymentModel.getByPaymentIntentId(paymentIntentId);
    if (!payment) {
      const err = new Error("Payment not found");
      err.statusCode = 404;
      throw err;
    }

    if (amount !== null) {
      const numericAmount = Number(amount);
      if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
        const err = new Error("Invalid refund amount");
        err.statusCode = 400;
        throw err;
      }
      if (numericAmount > Number(payment.amount)) {
        const err = new Error("Refund amount exceeds payment amount");
        err.statusCode = 400;
        throw err;
      }
    }

    await this.updatePaymentStatus(paymentIntentId, "refund_pending");

    try {
      return await paymentProvider.createRefund({
        paymentIntentId,
        amount: amount ?? undefined,
        reason,
      });
    } catch (err) {
      await this.updatePaymentStatus(paymentIntentId, "refund_failed");
      throw err;
    }
  },

  async handleStripeWebhook({ rawBody, signature }) {
    const event = paymentProvider.verifyWebhook({
      rawBody,
      signature,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    });

    if (event.type === "payment_intent.succeeded") {
      const pi = event.data.object;
      await this.updatePaymentStatus(pi.id, "succeeded");
      const cartId = Number(pi.metadata?.cartId);
      if (Number.isFinite(cartId) && cartId > 0) {
        await CartItemModel.removeByCartId(cartId);
      }
    }

    if (event.type === "payment_intent.payment_failed") {
      const pi = event.data.object;
      await this.updatePaymentStatus(pi.id, "failed");
    }

    if (event.type === "refund.updated") {
      const refund = event.data.object;
      const paymentIntentId = refund.payment_intent;
      if (paymentIntentId) {
        if (refund.status === "failed" || refund.status === "canceled") {
          await this.updatePaymentStatus(paymentIntentId, "refund_failed");
        }
      }
    }

    if (event.type === "charge.refunded") {
      const charge = event.data.object;
      const paymentIntentId = charge.payment_intent;
      if (paymentIntentId) {
        const isPartial = Number(charge.amount_refunded) < Number(charge.amount);
        const status = isPartial ? "partially_refunded" : "refunded";
        await this.updatePaymentStatus(paymentIntentId, status);
      }
    }

    return event;
  },
};

export default paymentService;
