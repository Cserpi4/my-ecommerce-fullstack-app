import pool from '../config/db.js';

const getCartByUserId = async userId => {
  const res = await pool.query('SELECT * FROM carts WHERE user_id = $1', [userId]);
  return res.rows[0];
};

const createCart = async userId => {
  const res = await pool.query('INSERT INTO carts(user_id) VALUES($1) RETURNING *', [userId]);
  return res.rows[0];
};

export default {
  getCartByUserId,
  createCart,
};
