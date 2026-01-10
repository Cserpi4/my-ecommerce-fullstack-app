import CartModel from "../models/CartModel.js";

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
};

export default cartService;
