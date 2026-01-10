import PaymentModel from "../models/PaymentModel.js";
import paymentProvider from "../utils/paymentProvider.js";

const paymentService = {
  async createPayment({ orderId, amount, currency = "usd" }) {
    const paymentIntent = await paymentProvider.createPaymentIntent({
      amount,
      currency,
      metadata: { orderId },
    });

    const dbPayment = await PaymentModel.create(
      orderId,
      amount,
      paymentIntent.method || "card",
      paymentIntent.status
    );

    return {
      dbPayment,
      clientSecret: paymentIntent.client_secret,
    };
  },

  async getPaymentById(paymentId) {
    return PaymentModel.getById(paymentId);
  },

  async updatePaymentStatus({ paymentIntentId, status }) {
    return PaymentModel.updateStatusByIntent(paymentIntentId, status);
  },
};

export default paymentService;
