import pool from '../config/db.js';

const OrderItemModel = {
  async add(orderId, productId, quantity, price) {
    const { rows } = await pool.query(
      `
      INSERT INTO order_items (order_id, product_id, quantity, price)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
      `,
      [orderId, productId, quantity, price]
    );
    return rows[0] || null;
  },

  async getByOrderId(orderId) {
    const { rows } = await pool.query(`SELECT * FROM order_items WHERE order_id=$1`, [orderId]);
    return rows;
  },
};

export default OrderItemModel;
