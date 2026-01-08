// server/controllers/orderController.js
import orderService from '../services/orderService.js';
import orderItemService from '../services/orderItemService.js';

const createOrder = async (req, res, next) => {
  try {
    const { totalAmount, items } = req.body;

    // 💡 Fejlesztői fallback (ha nincs authMiddleware)
    const userId = req.user?.id || 1; // Default user ID 1 — csak tesztre!

    // 🧾 1️⃣ Rendelés létrehozása
    const order = await orderService.createOrder(userId, totalAmount);

    // 🛒 2️⃣ Order items mentése
    const orderItems = await Promise.all(
      (items || []).map(item =>
        orderItemService.addItemToOrder(order.id, item.productId, item.quantity, item.price)
      )
    );

    // ✅ 3️⃣ Válasz küldése
    res.status(201).json({
      success: true,
      message: 'Order created successfully.',
      order,
      orderItems,
    });
  } catch (err) {
    console.error('❌ createOrder error:', err.message);
    next(err);
  }
};

const getOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const order = await orderService.getOrderById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (err) {
    console.error('❌ getOrder error:', err.message);
    next(err);
  }
};

export default {
  createOrder,
  getOrder,
};
