import pool from '../config/db.js';

const OrderItemModel = {
  async add({
    orderId,
    productId,
    quantity,
    price,
    productName = null,
    productImage = null,
  }) {
    const { rows } = await pool.query(
      `
      INSERT INTO order_items (order_id, product_id, quantity, price, product_name, product_image)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
      `,
      [orderId, productId, quantity, price, productName, productImage]
    );
    return rows[0] || null;
  },

  async getByOrderId(orderId) {
    const { rows } = await pool.query(`SELECT * FROM order_items WHERE order_id=$1`, [orderId]);
    return rows;
  },
};

export default OrderItemModel;
