// server/controllers/paymentController.js
import paymentService from '../services/paymentService.js';
import Stripe from 'stripe';
import config from '../config/index.js';

// Stripe init (backend secret kulcs)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || config.stripeSecretKey);

/**
 * Létrehoz egy új fizetést (Stripe PaymentIntent + DB mentés)
 */
const createPayment = async (req, res, next) => {
  try {
    const { orderId = null, amount, currency = 'usd' } = req.body;

    // 🔹 1. Stripe PaymentIntent létrehozása
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // centekben jön pl. 4999 = 49.99 USD
      currency,
      automatic_payment_methods: { enabled: true },
    });

    // 🔹 2. DB mentés a saját service rétegen keresztül
    const payment = await paymentService.createPayment({
      orderId,
      amount,
      currency,
    });

    // 🔹 3. client_secret visszaküldése a frontendnek
    res.status(201).json({
      success: true,
      message: 'Payment created successfully.',
      payment: {
        ...payment,
        client_secret: paymentIntent.client_secret, // 🟩 ez a kulcs, amit a frontend vár
      },
    });
  } catch (err) {
    console.error('❌ createPayment error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Payment creation failed.',
      error: err.message,
    });
  }
};

/**
 * Lekéri a fizetés adatait ID alapján
 */
const getPayment = async (req, res, next) => {
  try {
    const { paymentId } = req.params;
    const payment = await paymentService.getPaymentById(paymentId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    res.json({
      success: true,
      payment,
    });
  } catch (err) {
    console.error('❌ getPayment error:', err.message);
    next(err);
  }
};

/**
 * Stripe webhook callback (automatikus státusz frissítéshez)
 */
const handleStripeWebhook = async (req, res, next) => {
  try {
    res.json({ received: true });
  } catch (err) {
    console.error('❌ Stripe webhook error:', err.message);
    next(err);
  }
};

export default {
  createPayment,
  getPayment,
  handleStripeWebhook,
};
