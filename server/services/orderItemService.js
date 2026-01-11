import OrderItemModel from "../models/OrderItemModel.js";

const orderItemService = {
  async addItemToOrder({
    orderId,
    productId,
    quantity,
    price,
    productName = null,
    productImage = null,
  }) {
    return OrderItemModel.add({
      orderId,
      productId,
      quantity,
      price,
      productName,
      productImage,
    });
  },
};

export default orderItemService;
