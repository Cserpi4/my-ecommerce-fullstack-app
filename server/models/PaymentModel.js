// server/models/PaymentModel.js
import db from "../db/index.js";

const PaymentModel = {
  async create({
    orderId = null,
    amount,
    currency = "usd",
    status = "pending",
    provider = "stripe",
    paymentIntentId = null,
  }) {
    const result = await db.query(
      `
      INSERT INTO payments (order_id, provider, payment_intent_id, amount, currency, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [orderId, provider, paymentIntentId, amount, currency, status]
    );

    return result.rows[0] || null;
  },

  async getById(paymentId) {
    const result = await db.query(`SELECT * FROM payments WHERE id = $1`, [paymentId]);
    return result.rows[0] || null;
  },

  async getByPaymentIntentId(paymentIntentId) {
    const result = await db.query(`SELECT * FROM payments WHERE payment_intent_id = $1`, [
      paymentIntentId,
    ]);
    return result.rows[0] || null;
  },

  async updateStatusByPaymentIntentId(paymentIntentId, status) {
    const result = await db.query(
      `
      UPDATE payments
      SET status = $2
      WHERE payment_intent_id = $1
      RETURNING *
      `,
      [paymentIntentId, status]
    );

    return result.rows[0] || null;
  },
};

export default PaymentModel;
