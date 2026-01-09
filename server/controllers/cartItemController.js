import CartItemService from "../services/cartItemService.js";
import ErrorHandling from "../utils/errorHandling.js";

const CartItemController = {
  async addItem(req, res) {
    try {
      const { productId, quantity = 1 } = req.body;

      if (!productId) {
        return res.status(400).json({ success: false, error: "productId is required" });
      }

      const result = await CartItemService.addItem(req, productId, quantity);

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

      const result = await CartItemService.updateItem(req, cartItemId, quantity);

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

      const result = await CartItemService.removeItem(req, cartItemId);

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
