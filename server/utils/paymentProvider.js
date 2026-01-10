// server/utils/paymentProvider.js
import Stripe from 'stripe';
import config from '../config/index.js';

const stripe = new Stripe(config.stripeSecretKey, {
  apiVersion: '2022-11-15',
});

const paymentProvider = {
  // Fizetés létrehozása
  async createIntent({ amount, currency = 'usd', metadata = {} }) {
    return stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // centbe
      currency,
      metadata,
    });
  },

  // Fizetés lekérdezése
  async retrieveIntent(paymentIntentId) {
    return stripe.paymentIntents.retrieve(paymentIntentId);
  },

  // Refund
  async refund(paymentIntentId) {
    return stripe.refunds.create({
      payment_intent: paymentIntentId,
    });
  },
};

export default paymentProvider;
