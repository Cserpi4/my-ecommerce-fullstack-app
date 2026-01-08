// server/routes/paymentRoutes.js
import express from 'express';
import paymentController from '../controllers/paymentController.js';
import paymentService from '../services/paymentService.js';
import Stripe from 'stripe';
// import authMiddleware from '../middlewares/authMiddleware.js'; // 💡 majd később újra aktiválható

const router = express.Router();

// Stripe inicializálása (API verzióval a stabil működéshez)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

// 🔐 Auth protection minden fizetési művelethez (majd ha kész a login flow)
// router.use(authMiddleware.protect);

/**
 * @route POST /api/payments
 * @desc Stripe PaymentIntent létrehozása + DB mentés
 */
router.post('/', paymentController.createPayment);

/**
 * @route GET /api/payments/:paymentId
 * @desc Fizetés lekérése az adatbázisból
 */
router.get('/:paymentId', paymentController.getPayment);

/**
 * @route POST /api/payments/webhook
 * @desc Stripe webhook → automatikus státusz frissítés
 * ⚠️ Ez NEM autentikált, mert a Stripe hívja meg.
 * Fontos: az `express.raw()` middleware **kötelező** a Stripe aláírás validálásához.
 */
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // --- Fizetés sikeres ---
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      await paymentService.updatePaymentStatus(paymentIntent.id, 'succeeded');
      console.log('✅ Payment succeeded:', paymentIntent.id);
    }

    // --- Fizetés sikertelen ---
    if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object;
      await paymentService.updatePaymentStatus(paymentIntent.id, 'failed');
      console.warn('⚠️ Payment failed:', paymentIntent.id);
    }

    res.json({ received: true });
  }
);

export default router;
