import pool from "../config/db.js";

const CartModel = {
  async create(userId = null) {
    const res = await pool.query(
      "INSERT INTO carts (user_id) VALUES ($1) RETURNING *",
      [userId]
    );
    return res.rows[0] || null;
  },

  async getByUserId(userId) {
    const res = await pool.query(
      "SELECT * FROM carts WHERE user_id = $1",
      [userId]
    );
    return res.rows[0] || null;
  },

  async getById(cartId) {
    const res = await pool.query(
      "SELECT * FROM carts WHERE id = $1",
      [cartId]
    );
    return res.rows[0] || null;
  },

  async delete(cartId) {
    const res = await pool.query(
      "DELETE FROM carts WHERE id = $1 RETURNING *",
      [cartId]
    );
    return res.rows[0] || null;
  },
};

export default CartModel;
