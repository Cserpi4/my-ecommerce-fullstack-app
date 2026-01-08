import pool from '../config/db.js';

const CartItemModel = {
  async add(cartId, productId, quantity = 1) {
    const query = `
      INSERT INTO cart_items (cart_id, product_id, quantity)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [cartId, productId, quantity]);
    return rows[0];
  },

  async getByCartId(cartId) {
    const { rows } = await pool.query(`SELECT * FROM cart_items WHERE cart_id=$1`, [cartId]);
    return rows;
  },

  async remove(cartItemId) {
    await pool.query(`DELETE FROM cart_items WHERE id=$1`, [cartItemId]);
    return true;
  },
};

export default CartItemModel;
