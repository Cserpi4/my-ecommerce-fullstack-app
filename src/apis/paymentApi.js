import client from "./client.js";

const paymentApi = {
  async createPayment({ amount, metadata }) {
    const { data } = await client.post("/payments", { amount, metadata });
    return data;
  },

  async retrievePayment(paymentIntentId) {
    const { data } = await client.get(`/payments/${paymentIntentId}`);
    return data;
  },

  async refundPayment(paymentIntentId) {
    const { data } = await client.post("/payments/refund", { paymentIntentId });
    return data;
  },
};

export default paymentApi;
