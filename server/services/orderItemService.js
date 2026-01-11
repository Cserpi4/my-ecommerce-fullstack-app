import OrderItemModel from "../models/OrderItemModel.js";

const orderItemService = {
  async addItemToOrder({
    orderId,
    productId,
    quantity,
    price,
    productName,
    unitPrice,
    image,
  }) {
    return OrderItemModel.add({
      orderId,
      productId,
      quantity,
      price,
      productName,
      unitPrice,
      image,
    });
  },
};

export default orderItemService;
