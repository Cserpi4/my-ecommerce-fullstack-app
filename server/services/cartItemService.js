import pool from "../config/db.js";
import CartItemModel from "../models/cartItemModel.js";

const toPositiveInt = (value, fallback = 1) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(1, Math.floor(n));
};

const CartItemService = {
  async ensureCartId(req) {
    // body cartId (ha küldöd) -> session -> create
    const bodyCartId = req.body?.cartId || null;
    let cartId = bodyCartId || req.session?.cartId || null;

    if (!cartId) {
      const result = await pool.query(
        `INSERT INTO carts (user_id) VALUES ($1) RETURNING id`,
        [req.user?.id || null]
      );
      cartId = result.rows[0].id;
      if (req.session) req.session.cartId = cartId;
    }

    return cartId;
  },

  async addItem(req, productId, quantity = 1) {
    const cartId = await this.ensureCartId(req);
    const qty = toPositiveInt(quantity, 1);

    const existing = await CartItemModel.findByCartAndProduct(cartId, productId);

    if (existing) {
      await CartItemModel.incrementQuantity(existing.id, qty);
    } else {
      await CartItemModel.add(cartId, productId, qty);
    }

    const items = await CartItemModel.getByCartId(cartId);

    return {
      cartId,
      items,
    };
  },

  async updateItem(req, cartItemId, quantity) {
    const qty = toPositiveInt(quantity, 1);

    await CartItemModel.updateQuantity(cartItemId, qty);

    const cartId =
      req.session?.cartId ||
      (await pool
        .query(`SELECT cart_id FROM cart_items WHERE id=$1 LIMIT 1`, [cartItemId])
        .then(r => r.rows[0]?.cart_id || null));

    const items = cartId ? await CartItemModel.getByCartId(cartId) : [];

    return { cartId, items };
  },

  async removeItem(req, cartItemId) {
    const cartId =
      req.session?.cartId ||
      (await pool
        .query(`SELECT cart_id FROM cart_items WHERE id=$1 LIMIT 1`, [cartItemId])
        .then(r => r.rows[0]?.cart_id || null));

    await CartItemModel.remove(cartItemId);

    const items = cartId ? await CartItemModel.getByCartId(cartId) : [];

    return { cartId, items };
  },
};

export default CartItemService;
