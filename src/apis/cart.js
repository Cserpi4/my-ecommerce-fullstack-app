import client from './client.js'; // Axios instance

// Backend returns: { success: true, cart: {...} }
// Slice expects:   { success, data: {...} }
const normalize = (resp) => {
  return {
    success: resp?.success === true,
    data: resp?.cart ?? resp?.data ?? null,
  };
};

const cartApi = {
  async getCart() {
    const { data } = await client.get('/cart');
    return normalize(data);
  },

  async addItem(cartId, productId, quantity) {
    const { data } = await client.post('/cart/items', { cartId, productId, quantity });
    return normalize(data);
  },

  async updateItem(cartItemId, quantity) {
    const { data } = await client.put(`/cart/items/${cartItemId}`, { quantity });
    return normalize(data);
  },

  async removeItem(cartItemId) {
    const { data } = await client.delete(`/cart/items/${cartItemId}`);
    return normalize(data);
  },
};

export default cartApi;
