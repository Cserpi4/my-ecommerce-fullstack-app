import cartModel from '../models/cartModel.js';

const cartService = {

  async getCartByUserId(userId) {
    return cartModel.getByUserId(userId);
  },

  async getCartById(cartId) {
    return cartModel.getById(cartId);
  },

  async createCart(userId = null) {
    return cartModel.create(userId);
  },

  async getOrCreateCartByUserId(userId) {
    let cart = await cartModel.getByUserId(userId);

    if (!cart) {
      cart = await cartModel.create(userId);
    }

    return cart;
  },

};

export default cartService;
