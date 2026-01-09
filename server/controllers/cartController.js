import cartService from '../services/cartService.js';
import cartItemService from '../services/cartItemService.js';

const cartController = {

  async getUserCart(req, res, next) {
    try {
      // ✅ USER cart
      if (req.user?.id) {
        let cart = await cartService.getOrCreateCartByUserId(req.user.id);

        if (!cart || !Array.isArray(cart.items)) {
          cart = { 
            ...cart, 
            items: [], 
            total: cart?.total || 0 
          };
        }

        return res.json({ success: true, cart });
      }

      // ✅ ANON cart (session)
      if (req.session.cartId) {
        const cart = await cartService.getCartById(req.session.cartId);
        return res.json({ 
          success: true, 
          cart: cart || { items: [], total: 0, isAnonymous: true } 
        });
      }

      // ✅ teljesen üres anon user
      return res.json({ 
        success: true, 
        cart: { items: [], total: 0, isAnonymous: true } 
      });

    } catch (err) {
      next(err);
    }
  },


  async addItem(req, res, next) {
    try {
      const { productId, quantity } = req.body;

      let cartId;

      // ✅ USER
      if (req.user?.id) {
        const cart = await cartService.getOrCreateCartByUserId(req.user.id);
        cartId = cart.id;
      } 
      // ✅ ANON
      else {
        if (!req.session.cartId) {
          const cart = await cartService.createCart(null);
          req.session.cartId = cart.id;
        }
        cartId = req.session.cartId;
      }

      const item = await cartItemService.addItemToCart(cartId, productId, quantity);

      res.json({ success: true, item });

    } catch (err) {
      next(err);
    }
  },


  async removeItem(req, res, next) {
    try {
      const { cartItemId } = req.params;

      const removed = await cartItemService.removeItemFromCart(cartItemId);

      res.json({ success: true, removed });

    } catch (err) {
      next(err);
    }
  }

};

export default cartController;
