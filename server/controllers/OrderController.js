// server/controllers/OrderController.js
import orderService from "../services/orderService.js";
import orderItemService from "../services/orderItemService.js";
import cartService from "../services/cartService.js";
import CartItemModel from "../models/CartItemModel.js";

const OrderController = {
  async createOrder(req, res, next) {
    try {
      const { totalAmount, cartId } = req.body ?? {};

      // 💡 Fejlesztői fallback (ha nincs authMiddleware)
      const userId = req.user?.id || 1;

      let resolvedCartId = cartId;
      if (!resolvedCartId) {
        const cart = await cartService.getOrCreateCartByUserId(userId);
        resolvedCartId = cart?.id ?? null;
      }

      if (!resolvedCartId) {
        return res.status(400).json({
          success: false,
          message: "Missing cartId for order creation.",
        });
      }

      const cartItems = await CartItemModel.getByCartId(resolvedCartId);
      if (!cartItems.length) {
        return res.status(400).json({
          success: false,
          message: "Cart is empty.",
        });
      }

      const computedTotal = cartItems.reduce(
        (sum, item) => sum + Number(item.unit_price) * Number(item.quantity),
        0
      );

      if (
        typeof totalAmount !== "undefined" &&
        totalAmount !== null &&
        Number(totalAmount) !== computedTotal
      ) {
        console.warn(
          "⚠️ Order total mismatch:",
          Number(totalAmount),
          computedTotal
        );
      }

      const order = await orderService.createOrder({
        userId,
        totalAmount: computedTotal,
      });

      const orderItems = await Promise.all(
        cartItems.map((item) =>
          orderItemService.addItemToOrder({
            orderId: order.id,
            productId: item.product_id,
            quantity: item.quantity,
            price: item.unit_price,
            productName: item.name,
            unitPrice: item.unit_price,
            image: item.image,
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
