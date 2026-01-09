import cartService from '../services/cartService.js';
import CartItemModel from '../models/cartItemModel.js';

const computeTotal = (items) =>
  items.reduce((sum, it) => {
    const price = Number(it.unit_price ?? it.price ?? 0);
    const qty = Number(it.quantity ?? 0);
    return sum + price * qty;
  }, 0);

const cartController = {
  async getUserCart(req, res, next) {
    try {
      res.set('Cache-Control', 'no-store');

      // USER
      if (req.user?.id) {
        const cart = await cartService.getOrCreateCartByUserId(req.user.id);
        const cartId = cart?.id ?? null;
        const items = cartId ? await CartItemModel.getByCartId(cartId) : [];
        const total = computeTotal(items);

        return res.json({
          success: true,
          cart: { id: cartId, items, total, isAnonymous: false },
        });
      }

      // ANON (session)
      const cartId = req.session?.cartId ?? null;

      if (!cartId) {
        return res.json({
          success: true,
          cart: { id: null, items: [], total: 0, isAnonymous: true },
        });
      }

      let items = [];
      try {
        items = await CartItemModel.getByCartId(cartId);
      } catch (e) {
        // ha árva lett a session cartId
        req.session.cartId = null;
        return res.json({
          success: true,
          cart: { id: null, items: [], total: 0, isAnonymous: true },
        });
      }

      const total = computeTotal(items);

      return res.json({
        success: true,
        cart: { id: cartId, items, total, isAnonymous: true },
      });
    } catch (err) {
      next(err);
    }
  },
};

export default cartController;
