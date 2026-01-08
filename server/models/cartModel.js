import pool from '../config/db.js';

const CartModel = {
  async create(userId) {
    const query = `
      INSERT INTO carts (user_id, created_at)
      VALUES ($1, NOW())
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows[0];
  },

  async getByUserId(userId) {
    const { rows } = await pool.query(`SELECT * FROM carts WHERE user_id=$1`, [userId]);
    return rows[0];
  },

  async delete(cartId) {
    await pool.query(`DELETE FROM carts WHERE id=$1`, [cartId]);
    return true;
  },
};

export default CartModel;
