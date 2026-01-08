import pool from '../config/db.js';

const createOrder = async (userId, totalAmount, status = 'pending') => {
  const res = await pool.query(
    'INSERT INTO orders(user_id, total_amount, status) VALUES($1, $2, $3) RETURNING *',
    [userId, totalAmount, status]
  );
  return res.rows[0];
};

const getOrderById = async orderId => {
  const res = await pool.query('SELECT * FROM orders WHERE id = $1', [orderId]);
  return res.rows[0];
};

export default {
  createOrder,
  getOrderById,
};
