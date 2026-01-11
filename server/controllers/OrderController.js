// server/controllers/OrderController.js
import orderService from "../services/orderService.js";
import orderItemService from "../services/orderItemService.js";
import cartService from "../services/cartService.js";
import CartItemModel from "../models/CartItemModel.js";

const computeTotal = (items) =>
  items.reduce((sum, it) => {
    const price = Number(it.unit_price ?? it.price ?? 0);
    const qty = Number(it.quantity ?? 0);
    return sum + price * qty;
  }, 0);

const OrderController = {
  async createOrder(req, res, next) {
    try {
      const { cartId: bodyCartId } = req.body ?? {};

      // 💡 Fejlesztői fallback (ha nincs authMiddleware)
      const userId = req.user?.id || 1;

      const requestedCartId = bodyCartId ? Number(bodyCartId) : null;
      const resolvedCartId = Number.isFinite(requestedCartId)
        ? requestedCartId
        : (await cartService.getCartByUserId(userId))?.id ?? null;

      if (!resolvedCartId) {
        return res.status(400).json({
          success: false,
          message: "Cart not found.",
        });
      }

      const cartItems = await CartItemModel.getByCartId(resolvedCartId);
      const totalAmount = computeTotal(cartItems);

      if (!cartItems.length || totalAmount <= 0) {
        return res.status(400).json({
          success: false,
          message: "Cart is empty.",
        });
      }

      const order = await orderService.createOrder({
        userId,
        totalAmount,
      });

      const orderItems = await Promise.all(
        cartItems.map((item) =>
          orderItemService.addItemToOrder({
            orderId: order.id,
            productId: item.product_id ?? item.productId,
            quantity: item.quantity,
            price: item.unit_price ?? item.price,
            productName: item.name ?? null,
            productImage: item.image ?? null,
          })
        )
      );

      res.status(201).json({
        success: true,
        message: "Order created successfully.",
        order,
        orderItems,
      });
    } catch (err) {
      console.error("❌ createOrder error:", err.message);
      next(err);
    }
  },

  async getOrder(req, res, next) {
    try {
      const { orderId } = req.params;

      const order = await orderService.getOrderById(orderId);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      res.json({
        success: true,
        order,
      });
    } catch (err) {
      console.error("❌ getOrder error:", err.message);
      next(err);
    }
  },
};

export default OrderController;
