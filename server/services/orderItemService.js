import pool from '../config/db.js';

const addItemToOrder = async (orderId, productId, quantity, price) => {
  const res = await pool.query(
    'INSERT INTO order_items(order_id, product_id, quantity, price) VALUES($1, $2, $3, $4) RETURNING *',
    [orderId, productId, quantity, price]
  );
  return res.rows[0];
};

export default {
  addItemToOrder,
};
