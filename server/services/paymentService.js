// server/services/paymentService.js
import pool from '../config/db.js';
import paymentProvider from '../utils/paymentProvider.js';

/**
 * Létrehoz egy új PaymentIntent-et Stripe-ban és elmenti az adatbázisba.
 */
const createPayment = async ({ orderId, amount, currency = 'usd' }) => {
  const paymentIntent = await paymentProvider.createPaymentIntent({
    amount,
    currency,
    metadata: { orderId },
  });

  const res = await pool.query(
    `
    INSERT INTO payments (order_id, payment_intent_id, amount, currency, status, created_at)
    VALUES ($1, $2, $3, $4, $5, NOW())
    RETURNING *;
    `,
    [orderId, paymentIntent.id, amount, currency, paymentIntent.status]
  );

  return {
    dbPayment: res.rows[0],
    clientSecret: paymentIntent.client_secret,
  };
};

/**
 * Lekérdezés az adatbázisból ID alapján.
 */
const getPaymentById = async paymentId => {
  const res = await pool.query('SELECT * FROM payments WHERE id = $1', [paymentId]);
  return res.rows[0];
};

/**
 * Stripe webhook után a fizetés státuszának frissítése.
 */
const updatePaymentStatus = async (paymentIntentId, status) => {
  const res = await pool.query(
    `UPDATE payments SET status=$1, updated_at=NOW() WHERE payment_intent_id=$2 RETURNING *`,
    [status, paymentIntentId]
  );
  return res.rows[0];
};

export default {
  createPayment,
  getPaymentById,
  updatePaymentStatus,
};
