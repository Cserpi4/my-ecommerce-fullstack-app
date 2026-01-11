import OrderModel from "../models/OrderModel.js";
import { isValidOrderStatusTransition } from "../constants/orderStatus.js";

const orderService = {
  async createOrder({ userId, totalAmount }) {
    return OrderModel.create(userId, totalAmount);
  },

  async getOrderById(orderId) {
    return OrderModel.getById(orderId);
  },

  async updateOrderStatus(orderId, status, { strict = true } = {}) {
    const order = await OrderModel.getById(orderId);
    if (!order) {
      const err = new Error("Order not found");
      err.statusCode = 404;
      throw err;
    }

    if (!isValidOrderStatusTransition(order.status, status)) {
      if (strict) {
        const err = new Error("Invalid order status transition");
        err.statusCode = 409;
        throw err;
      }
      return order;
    }

    return OrderModel.updateStatus(orderId, status);
  },
};

export default orderService;
