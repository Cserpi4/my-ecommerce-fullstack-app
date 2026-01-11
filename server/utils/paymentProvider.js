// server/utils/paymentProvider.js
import Stripe from "stripe";
import config from "../config/index.js";

const secretKey = process.env.STRIPE_SECRET_KEY || config.stripeSecretKey;

const stripe = secretKey
  ? new Stripe(secretKey, { apiVersion: "2024-06-20" })
  : null;

const paymentProvider = {
  getStripe() {
    if (!stripe) throw new Error("Missing STRIPE_SECRET_KEY");
    return stripe;
  },

  async createPaymentIntent({ amount, currency = "usd", metadata = {}, idempotencyKey = null }) {
    const s = this.getStripe();

    const params = {
      amount,
      currency,
      automatic_payment_methods: { enabled: true },
      metadata,
    };

    if (idempotencyKey) {
      return s.paymentIntents.create(params, { idempotencyKey });
    }

    return s.paymentIntents.create(params);
  },

  verifyWebhook({ rawBody, signature, webhookSecret }) {
    const s = this.getStripe();
    if (!webhookSecret) throw new Error("Missing STRIPE_WEBHOOK_SECRET");

    return s.webhooks.constructEvent(rawBody, signature, webhookSecret);
  },
};

export default paymentProvider;
