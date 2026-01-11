import orderItemService from "../services/orderItemService.js";

const OrderItemController = {
  async getOrderItems(req, res, next) {
    try {
      const { orderId } = req.params;
      const items = await orderItemService.getItemsByOrderId(orderId);
      res.json({ success: true, items });
    } catch (err) {
      next(err);
    }
  },

  async addOrderItem(req, res, next) {
    try {
      const { orderId, productId, quantity, price, productName, productImage } = req.body;
      const item = await orderItemService.addItemToOrder({
        orderId,
        productId,
        quantity,
        price,
        productName,
        productImage,
      });
      res.json({ success: true, item });
    } catch (err) {
      next(err);
    }
  },

  async removeOrderItem(req, res, next) {
    try {
      const { orderItemId } = req.params;
      const removed = await orderItemService.removeItemFromOrder(orderItemId);
      res.json({ success: true, removed });
    } catch (err) {
      next(err);
    }
  },
};

export default OrderItemController;
