import pool from '../config/db.js';

const PaymentModel = {
  async create(orderId, amount, method, status = 'pending') {
    const { rows } = await pool.query(
      `
      INSERT INTO payments (order_id, amount, method, status, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING *;
      `,
      [orderId, amount, method, status]
    );
    return rows[0];
  },

  async getByOrderId(orderId) {
    const { rows } = await pool.query(`SELECT * FROM payments WHERE order_id=$1`, [orderId]);
    return rows;
  },

  async updateStatus(paymentId, status) {
    const { rows } = await pool.query(`UPDATE payments SET status=$1 WHERE id=$2 RETURNING *`, [
      status,
      paymentId,
    ]);
    return rows[0];
  },
};

export default PaymentModel;
