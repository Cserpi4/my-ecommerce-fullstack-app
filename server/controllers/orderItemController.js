import orderItemService from '../services/orderItemService.js';

// Rendelés tétel lekérdezése
const getOrderItems = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const items = await orderItemService.getItemsByOrderId(orderId);
    res.json({ success: true, items });
  } catch (err) {
    next(err);
  }
};

// Rendelés tétel hozzáadása
const addOrderItem = async (req, res, next) => {
  try {
    const { orderId, productId, quantity, price } = req.body;
    const item = await orderItemService.addItemToOrder(orderId, productId, quantity, price);
    res.json({ success: true, item });
  } catch (err) {
    next(err);
  }
};

// Rendelés tétel törlése
const removeOrderItem = async (req, res, next) => {
  try {
    const { orderItemId } = req.params;
    const removed = await orderItemService.removeItemFromOrder(orderItemId);
    res.json({ success: true, removed });
  } catch (err) {
    next(err);
  }
};

export default { getOrderItems, addOrderItem, removeOrderItem };
