import client from './client.js';

const createPayment = async ({ amount, metadata }) => {
  const { data } = await client.post('/payments', { amount, metadata });
  return data;
};

const retrievePayment = async paymentIntentId => {
  const { data } = await client.get(`/payments/${paymentIntentId}`);
  return data;
};

const refundPayment = async paymentIntentId => {
  const { data } = await client.post(`/payments/refund`, { paymentIntentId });
  return data;
};

export default { createPayment, retrievePayment, refundPayment };
