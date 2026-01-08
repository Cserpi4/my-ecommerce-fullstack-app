import pool from '../config/db.js';

const addItemToCart = async (cartId, productId, quantity) => {
  const res = await pool.query(
    'INSERT INTO cart_items(cart_id, product_id, quantity) VALUES($1, $2, $3) RETURNING *',
    [cartId, productId, quantity]
  );
  return res.rows[0];
};

const removeItemFromCart = async cartItemId => {
  const res = await pool.query('DELETE FROM cart_items WHERE id = $1 RETURNING *', [cartItemId]);
  return res.rows[0];
};

export default {
  addItemToCart,
  removeItemFromCart,
};
