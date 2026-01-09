import pool from "../config/db.js";

const CartItemModel = {
  async add(cartId, productId, quantity = 1) {
    const res = await pool.query(
      `INSERT INTO cart_items (cart_id, product_id, quantity)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [cartId, productId, quantity]
    );
    return res.rows[0];
  },

  async findByCartAndProduct(cartId, productId) {
    const res = await pool.query(
      `SELECT * FROM cart_items WHERE cart_id=$1 AND product_id=$2 LIMIT 1`,
      [cartId, productId]
    );
    return res.rows[0] || null;
  },

  async incrementQuantity(cartItemId, qty = 1) {
    const res = await pool.query(
      `UPDATE cart_items SET quantity = quantity + $1 WHERE id=$2 RETURNING *`,
      [qty, cartItemId]
    );
    return res.rows[0];
  },

  async updateQuantity(cartItemId, quantity) {
    const res = await pool.query(
      `UPDATE cart_items SET quantity=$1 WHERE id=$2 RETURNING *`,
      [quantity, cartItemId]
    );
    return res.rows[0];
  },

  async getByCartId(cartId) {
    const res = await pool.query(`SELECT * FROM cart_items WHERE cart_id=$1`, [cartId]);
    return res.rows;
  },

  async remove(cartItemId) {
    const res = await pool.query(`DELETE FROM cart_items WHERE id=$1 RETURNING *`, [cartItemId]);
    return res.rows[0] || null;
  },
};

export default CartItemModel;
