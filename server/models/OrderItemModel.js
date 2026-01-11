import pool from '../config/db.js';

const OrderItemModel = {
  async add({
    orderId,
    productId,
    quantity,
    price,
    productName,
    unitPrice,
    image,
  }) {
    const { rows } = await pool.query(
      `
      INSERT INTO order_items (
        order_id,
        product_id,
        quantity,
        price,
        product_name,
        unit_price,
        image
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
      `,
      [orderId, productId, quantity, price, productName, unitPrice, image]
    );
    return rows[0] || null;
  },

  async getByOrderId(orderId) {
    const { rows } = await pool.query(`SELECT * FROM order_items WHERE order_id=$1`, [orderId]);
    return rows;
  },
};

export default OrderItemModel;
