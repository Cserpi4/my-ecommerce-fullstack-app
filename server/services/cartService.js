import CartModel from "../models/CartModel.js";
import CartItemModel from "../models/CartItemModel.js";

const cartService = {
  async getCartByUserId(userId) {
    return CartModel.getByUserId(userId);
  },

  async getCartById(cartId) {
    return CartModel.getById(cartId);
  },

  async createCart(userId = null) {
    return CartModel.create(userId);
  },

  async getOrCreateCartByUserId(userId) {
    let cart = await CartModel.getByUserId(userId);

    if (!cart) {
      cart = await CartModel.create(userId);
    }

    return cart;
  },

  async mergeCarts(sourceCartId, targetCartId) {
    if (!sourceCartId || !targetCartId || sourceCartId === targetCartId) {
      return null;
    }

    const sourceItems = await CartItemModel.getByCartId(sourceCartId);

    for (const item of sourceItems) {
      const existing = await CartItemModel.findByCartAndProduct(
        targetCartId,
        item.product_id
      );

      if (existing) {
        await CartItemModel.incrementQuantity(existing.id, item.quantity);
      } else {
        await CartItemModel.add(targetCartId, item.product_id, item.quantity);
      }
    }

    await CartItemModel.removeByCartId(sourceCartId);
    await CartModel.delete(sourceCartId);

    return { sourceCartId, targetCartId, movedItems: sourceItems.length };
  },
};

export default cartService;
