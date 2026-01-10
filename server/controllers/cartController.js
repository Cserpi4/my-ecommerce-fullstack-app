import cartService from "../services/cartService.js";
import CartItemModel from "../models/CartItemModel.js";

const computeTotal = (items) =>
  items.reduce((sum, it) => {
    const price = Number(it.unit_price ?? it.price ?? 0);
    const qty = Number(it.quantity ?? 0);
    return sum + price * qty;
  }, 0);

const toIntOrNull = (v) => {
  const n = Number(v);
  return Number.isInteger(n) && n > 0 ? n : null;
};

const CartController = {
  async getUserCart(req, res, next) {
    try {
      res.set("Cache-Control", "no-store");

      console.log("GET /api/cart -> x-cart-id header:", req.get("x-cart-id"));
      console.log("GET /api/cart -> session cartId:", req.session?.cartId);
      console.log("GET /api/cart -> sessionID:", req.sessionID);

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

      // ANON
      const headerCartId = toIntOrNull(req.get("x-cart-id"));
      const sessionCartId = toIntOrNull(req.session?.cartId);
      const cartId = sessionCartId ?? headerCartId;

      if (!cartId) {
        return res.json({
          success: true,
          cart: { id: null, items: [], total: 0, isAnonymous: true },
        });
      }

      if (!sessionCartId && req.session) {
        req.session.cartId = cartId;
      }

      let items = [];
      try {
        items = await CartItemModel.getByCartId(cartId);
      } catch (e) {
        if (req.session) req.session.cartId = null;
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

export default CartController;
