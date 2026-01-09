import pool from '../config/db.js';

const cartModel = {

  async create(userId = null) {
    const res = await pool.query(
      'INSERT INTO carts (user_id) VALUES ($1) RETURNING *',
      [userId]
    );
    return res.rows[0];
  },

  async getByUserId(userId) {
    const res = await pool.query(
      'SELECT * FROM carts WHERE user_id = $1',
      [userId]
    );
    return res.rows[0];
  },

  async getById(cartId) {
    const res = await pool.query(
      'SELECT * FROM carts WHERE id = $1',
      [cartId]
    );
    return res.rows[0];
  },

  async delete(cartId) {
    await pool.query(
      'DELETE FROM carts WHERE id = $1',
      [cartId]
    );
    return true;
  },

};

export default cartModel;
