import pool from "../config/db.js";
import CartItemModel from "../models/cartItemModel.js";

const toPositiveInt = (value, fallback = 1) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(1, Math.floor(n));
};

const CartItemService = {
  async ensureCartId(req) {
    if (!req.session) {
      throw new Error("Session is not available on request (check session middleware order).");
    }

    let cartId = req.session.cartId || null;

    if (!cartId) {
      const result = await pool.query(
        `INSERT INTO carts (user_id) VALUES ($1) RETURNING id`,
        [req.user?.id || null]
      );

      cartId = result.rows[0]?.id || null;

      if (!cartId) {
        throw new Error("Failed to create cart (no id returned).");
      }

      req.session.cartId = cartId;
    }

    return cartId;
  },

  async getCartIdByCartItemId(cartItemId) {
    const res = await pool.query(
      `SELECT cart_id FROM cart_items WHERE id=$1 LIMIT 1`,
      [cartItemId]
    );
    return res.rows[0]?.cart_id || null;
  },

  async addItem(req, productId, quantity = 1) {
    const pid = Number(productId);
    if (!Number.isFinite(pid)) {
      throw new Error("Invalid productId");
    }

    const cartId = await this.ensureCartId(req);
    const qty = toPositiveInt(quantity, 1);

    const existing = await CartItemModel.findByCartAndProduct(cartId, pid);

    if (existing) {
      await CartItemModel.incrementQuantity(existing.id, qty);
    } else {
      await CartItemModel.add(cartId, pid, qty);
    }

    const items = await CartItemModel.getByCartId(cartId);

    return { cartId, items };
  },

  async updateItem(req, cartItemId, quantity) {
    const id = Number(cartItemId);
    if (!Number.isFinite(id)) {
      throw new Error("Invalid cartItemId");
    }

    const qty = toPositiveInt(quantity, 1);

    await CartItemModel.updateQuantity(id, qty);

    const cartId = req.session?.cartId || (await this.getCartIdByCartItemId(id));
    const items = cartId ? await CartItemModel.getByCartId(cartId) : [];

    return { cartId, items };
  },

  async removeItem(req, cartItemId) {
    const id = Number(cartItemId);
    if (!Number.isFinite(id)) {
      throw new Error("Invalid cartItemId");
    }

    const cartId = req.session?.cartId || (await this.getCartIdByCartItemId(id));

    await CartItemModel.remove(id);

    const items = cartId ? await CartItemModel.getByCartId(cartId) : [];

    return { cartId, items };
  },
};

export default CartItemService;
