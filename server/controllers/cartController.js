import cartService from '../services/cartService.js';
import CartItemModel from '../models/cartItemModel.js';

const cartController = {
  async getUserCart(req, res, next) {
    try {
      // 🔥 cartnál ne cache-eljünk
      res.set('Cache-Control', 'no-store');

      // ✅ USER cart
      if (req.user?.id) {
        const cart = await cartService.getOrCreateCartByUserId(req.user.id);
        const cartId = cart?.id ?? null;

        const items = cartId ? await CartItemModel.getByCartId(cartId) : [];

        return res.json({
          success: true,
          cart: {
            id: cartId,
            items,
            total: 0,
            isAnonymous: false,
          },
        });
      }

      // ✅ ANON cart (session)
      const cartId = req.session?.cartId ?? null;

      if (!cartId) {
        return res.json({
          success: true,
          cart: { id: null, items: [], total: 0, isAnonymous: true },
        });
      }

      const items = await CartItemModel.getByCartId(cartId);

      return res.json({
        success: true,
        cart: { id: cartId, items, total: 0, isAnonymous: true },
      });
    } catch (err) {
      next(err);
    }
  },
};

export default cartController;
