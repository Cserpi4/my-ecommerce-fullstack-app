import OrderItemModel from "../models/OrderItemModel.js";

const orderItemService = {
  async addItemToOrder({ orderId, productId, quantity, price }) {
    return OrderItemModel.add(orderId, productId, quantity, price);
  },
};

export default orderItemService;
