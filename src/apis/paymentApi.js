import client from "./client.js";

const paymentApi = {
  async createPayment() {
    const { data } = await client.post("/payments", {});
    return data;
  },

  async retrievePayment(paymentId) {
    const { data } = await client.get(`/payments/${paymentId}`);
    return data;
  },
};

export default paymentApi;
