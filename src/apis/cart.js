import client from './client.js'; // Axios instance

// Backend may return: { success: true, cart } OR { success: true, item } OR { success, data }
// Slice expects: { success, data }
const normalize = (resp) => ({
  success: resp?.success === true,
  data: resp?.cart ?? resp?.item ?? resp?.data ?? null,
  message: resp?.message ?? null,
});

const cartApi = {
  async getCart() {
    const { data } = await client.get('/cart');
    return normalize(data);
  },

  // ✅ No cartId param: backend uses user or session cart
  async addItem(productId, quantity) {
    const { data } = await client.post('/cart/items', { productId, quantity });
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
