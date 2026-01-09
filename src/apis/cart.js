import client from './client.js'; // Axios instance

const getCart = async () => {
  const { data } = await client.get('/cart'); 
  // backend: { success: true, cart: {...} }
  return { success: data?.success, data: data?.cart };
};

const addItem = async (cartId, productId, quantity) => {
  const { data } = await client.post('/cart/items', { cartId, productId, quantity });
  // ha backend: { success: true, cart: {...} } vagy { success:true, item: {...} }
  return { success: data?.success, data: data?.cart ?? data?.item ?? data };
};

const updateItem = async (cartItemId, quantity) => {
  const { data } = await client.put(`/cart/items/${cartItemId}`, { quantity });
  return { success: data?.success, data: data?.cart ?? data?.item ?? data };
};

const removeItem = async cartItemId => {
  const { data } = await client.delete(`/cart/items/${cartItemId}`);
  return { success: data?.success, data: data?.cart ?? data };
};

export default { getCart, addItem, updateItem, removeItem };
