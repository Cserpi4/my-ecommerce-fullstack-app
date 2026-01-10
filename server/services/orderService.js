import OrderModel from "../models/OrderModel.js";

const orderService = {
  async createOrder({ userId, totalAmount }) {
    return OrderModel.create(userId, totalAmount);
  },

  async getOrderById(orderId) {
    return OrderModel.getById(orderId);
  },
};

export default orderService;
