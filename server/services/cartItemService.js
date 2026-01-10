import CartItemModel from "../models/CartItemModel.js";
import CartModel from "../models/CartModel.js";

const toPositiveInt = (value, fallback = 1) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(1, Math.floor(n));
};

const cartItemService = {
  async createCartIfNotExists({ cartId, userId = null }) {
    if (cartId) return cartId;

    const cart = await CartModel.create(userId);
    if (!cart?.id) throw new Error("Failed to create cart");

    return cart.id;
  },

  async addItem({ cartId, userId, productId, quantity = 1 }) {
    const pid = Number(productId);
    if (!Number.isFinite(pid)) throw new Error("Invalid productId");

    const finalCartId = await this.createCartIfNotExists({ cartId, userId });
    const qty = toPositiveInt(quantity, 1);

    const existing = await CartItemModel.findByCartAndProduct(finalCartId, pid);

    if (existing) {
      await CartItemModel.incrementQuantity(existing.id, qty);
    } else {
      await CartItemModel.add(finalCartId, pid, qty);
    }

    const items = await CartItemModel.getByCartId(finalCartId);

    return { cartId: finalCartId, items };
  },

  async updateItem({ cartId, cartItemId, quantity }) {
    const id = Number(cartItemId);
    if (!Number.isFinite(id)) throw new Error("Invalid cartItemId");

    const qty = toPositiveInt(quantity, 1);

    await CartItemModel.updateQuantity(id, qty);

    if (!cartId) return { cartId: null, items: [] };

    const items = await CartItemModel.getByCartId(cartId);
    return { cartId, items };
  },

  async removeItem({ cartId, cartItemId }) {
    const id = Number(cartItemId);
    if (!Number.isFinite(id)) throw new Error("Invalid cartItemId");

    await CartItemModel.remove(id);

    if (!cartId) return { cartId: null, items: [] };

    const items = await CartItemModel.getByCartId(cartId);
    return { cartId, items };
  },
};

export default cartItemService;
