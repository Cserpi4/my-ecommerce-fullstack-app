// server/utils/paymentProvider.js
import Stripe from 'stripe';
import config from '../config/index.js';

const stripe = new Stripe(config.stripeSecretKey, {
  apiVersion: '2022-11-15',
});

// Fizetés létrehozása
const createPaymentIntent = async ({ amount, currency = 'usd', metadata = {} }) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // centre konvertálás
    currency,
    metadata,
  });
  return paymentIntent;
};

// Fizetés lekérdezése
const retrievePaymentIntent = async paymentIntentId => {
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  return paymentIntent;
};

// Refund létrehozása
const refundPayment = async paymentIntentId => {
  const refund = await stripe.refunds.create({
    payment_intent: paymentIntentId,
  });
  return refund;
};

export default {
  createPaymentIntent,
  retrievePaymentIntent,
  refundPayment,
};
