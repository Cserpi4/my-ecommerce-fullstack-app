import CartItemModel from "../models/cartItemModel.js";
import pool from "../config/db.js";
import handleError from "../utils/errorHandling.js";

const CartItemController = {
  async addItem(req, res) {
    try {
      const { productId, quantity = 1 } = req.body;

      if (!productId) {
        return res.status(400).json({ success: false, error: "productId is required" });
      }

      // Ensure cart exists (session + DB)
      let cartId = req.session?.cartId || null;

      if (!cartId) {
        const result = await pool.query(
          `INSERT INTO carts (user_id) VALUES ($1) RETURNING id`,
          [req.user?.id || null]
        );
        cartId = result.rows[0].id;
        req.session.cartId = cartId;
      }

      // If item exists -> increment quantity, else insert
      const existing = await pool.query(
        `SELECT id, quantity FROM cart_items WHERE cart_id=$1 AND product_id=$2 LIMIT 1`,
        [cartId, productId]
      );

      if (existing.rows.length > 0) {
        const existingId = existing.rows[0].id;
        await pool.query(
          `UPDATE cart_items SET quantity = quantity + $1 WHERE id=$2`,
          [Number(quantity) || 1, existingId]
        );
      } else {
        await CartItemModel.add(cartId, productId, Number(quantity) || 1);
      }

      const items = await CartItemModel.getByCartId(cartId);

      return res.status(200).json({
        success: true,
        cart: {
          items,
          total: 0, // később: JOIN products + összegzés
          isAnonymous: !req.user,
        },
      });
    } catch (error) {
      handleError(res, error, "Failed to add item to cart");
    }
  },

  async updateItem(req, res) {
    try {
      const { cartItemId } = req.params;
      const { quantity } = req.body;

      if (!cartItemId) {
        return res.status(400).json({ success: false, error: "cartItemId is required" });
      }

      const qty = Number(quantity);
      if (!Number.isFinite(qty) || qty < 1) {
        return res.status(400).json({ success: false, error: "quantity must be a positive number" });
      }

      await pool.query(`UPDATE cart_items SET quantity=$1 WHERE id=$2`, [qty, cartItemId]);

      const cartId = req.session?.cartId || null;
      const items = cartId ? await CartItemModel.getByCartId(cartId) : [];

      return res.status(200).json({
        success: true,
        cart: {
          items,
          total: 0,
          isAnonymous: !req.user,
        },
      });
    } catch (error) {
      handleError(res, error, "Failed to update cart item");
    }
  },

  async removeItem(req, res) {
    try {
      const { cartItemId } = req.params;

      if (!cartItemId) {
        return res.status(400).json({ success: false, error: "cartItemId is required" });
      }

      await CartItemModel.remove(cartItemId);

      const cartId = req.session?.cartId || null;
      const items = cartId ? await CartItemModel.getByCartId(cartId) : [];

      return res.status(200).json({
        success: true,
        cart: {
          items,
          total: 0,
          isAnonymous: !req.user,
        },
      });
    } catch (error) {
      handleError(res, error, "Failed to remove cart item");
    }
  },
};

export default CartItemController;
