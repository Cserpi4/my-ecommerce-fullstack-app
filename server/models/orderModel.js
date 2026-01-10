import pool from "../config/db.js";

const OrderModel = {
  async create(userId, total) {
    const { rows } = await pool.query(
      `
      INSERT INTO orders (user_id, total_amount, status, created_at)
      VALUES ($1, $2, 'pending', NOW())
      RETURNING *;
      `,
      [userId, total]
    );

    return rows[0] || null;
  },

  async getById(orderId) {
    const { rows } = await pool.query(
      "SELECT * FROM orders WHERE id = $1",
      [orderId]
    );

    return rows[0] || null;
  },

  async getByUserId(userId) {
    const { rows } = await pool.query(
      "SELECT * FROM orders WHERE user_id = $1",
      [userId]
    );

    return rows;
  },

  async updateStatus(orderId, status) {
    const { rows } = await pool.query(
      "UPDATE orders SET status = $1 WHERE id = $2 RETURNING *",
      [status, orderId]
    );

    return rows[0] || null;
  },
};

export default OrderModel;
