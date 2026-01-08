import client from './client.js'; // Axios instance

const getCart = async () => {
  const { data } = await client.get('/cart');
  return data;
};

const addItem = async (cartId, productId, quantity) => {
  const { data } = await client.post('/cart/items', { cartId, productId, quantity });
  return data;
};

const updateItem = async (cartItemId, quantity) => {
  const { data } = await client.put(`/cart/items/${cartItemId}`, { quantity });
  return data;
};

const removeItem = async cartItemId => {
  const { data } = await client.delete(`/cart/items/${cartItemId}`);
  return data;
};

export default { getCart, addItem, updateItem, removeItem };
