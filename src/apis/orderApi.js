import client from "./client.js";

const orderApi = {
  async getOrders() {
    const { data } = await client.get("/orders");
    return data;
  },

  async createOrder(orderData) {
    const { data } = await client.post("/orders", orderData);
    return data;
  },

  async getOrderItems(orderId) {
    const { data } = await client.get(`/order-items/${orderId}`);
    return data;
  },

  async addOrderItem(orderItemData) {
    const { data } = await client.post("/order-items", orderItemData);
    return data;
  },
};

export default orderApi;
