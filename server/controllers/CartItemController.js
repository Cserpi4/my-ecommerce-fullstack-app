import cartItemService from "../services/cartItemService.js";
import ErrorHandling from "../utils/errorHandling.js";

const toIntOrNull = (v) => {
  const n = Number(v);
  return Number.isInteger(n) && n > 0 ? n : null;
};

const CartItemController = {
  async addItem(req, res) {
    try {
      const { productId, quantity = 1 } = req.body;

      if (!productId) {
        return res.status(400).json({ success: false, error: "productId is required" });
      }

      const headerCartId = toIntOrNull(req.get("x-cart-id"));
      const sessionCartId = toIntOrNull(req.session?.cartId);
      const cartId = headerCartId ?? sessionCartId; // header-first
      const userId = req.user?.id ?? null;

      const result = await cartItemService.addItem({
        cartId,
        userId,
        productId,
        quantity,
      });

      // anon usernél szinkronizáljuk vissza a sessiont
      if (!userId && req.session && result.cartId) {
        req.session.cartId = result.cartId;
      }

      return res.status(200).json({
        success: true,
        cart: {
          id: result.cartId ?? null,
          items: result.items ?? [],
          total: 0,
          isAnonymous: !req.user?.id,
        },
      });
    } catch (error) {
      return ErrorHandling.handleError(res, error, "Failed to add item to cart");
    }
  },

  async updateItem(req, res) {
    try {
      const { cartItemId } = req.params;
      const { quantity } = req.body;

      if (!cartItemId) {
        return res.status(400).json({ success: false, error: "cartItemId is required" });
      }

      const headerCartId = toIntOrNull(req.get("x-cart-id"));
      const sessionCartId = toIntOrNull(req.session?.cartId);
      const cartId = headerCartId ?? sessionCartId;

      const result = await cartItemService.updateItem({
        cartId,
        cartItemId,
        quantity,
      });

      return res.status(200).json({
        success: true,
        cart: {
          id: result.cartId ?? null,
          items: result.items ?? [],
          total: 0,
          isAnonymous: !req.user?.id,
        },
      });
    } catch (error) {
      return ErrorHandling.handleError(res, error, "Failed to update cart item");
    }
  },

  async removeItem(req, res) {
    try {
      const { cartItemId } = req.params;

      if (!cartItemId) {
        return res.status(400).json({ success: false, error: "cartItemId is required" });
      }

      const headerCartId = toIntOrNull(req.get("x-cart-id"));
      const sessionCartId = toIntOrNull(req.session?.cartId);
      const cartId = headerCartId ?? sessionCartId;

      const result = await cartItemService.removeItem({
        cartId,
        cartItemId,
      });

      return res.status(200).json({
        success: true,
        cart: {
          id: result.cartId ?? null,
          items: result.items ?? [],
          total: 0,
          isAnonymous: !req.user?.id,
        },
      });
    } catch (error) {
      return ErrorHandling.handleError(res, error, "Failed to remove cart item");
    }
  },
};

export default CartItemController;
