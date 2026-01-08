import client from './client.js';

const getOrders = async () => {
  const { data } = await client.get('/orders');
  return data;
};

const createOrder = async orderData => {
  const { data } = await client.post('/orders', orderData);
  return data;
};

const getOrderItems = async orderId => {
  const { data } = await client.get(`/order-items/${orderId}`);
  return data;
};

const addOrderItem = async orderItemData => {
  const { data } = await client.post('/order-items', orderItemData);
  return data;
};

export default { getOrders, createOrder, getOrderItems, addOrderItem };
