import client from './client.js'; // Axios instance

// Backend may return: { success: true, cart } OR { success: true, item } OR { success, data }
// Slice expects: { success, data }
const normalize = (resp) => ({
  success: resp?.success === true,
  data: resp?.cart ?? resp?.item ?? resp?.data ?? null,
  message: resp?.message ?? null,
});

const saveCartIdIfPresent = (normalized) => {
  const id = normalized?.data?.id ?? normalized?.data?.cartId ?? null;
  if (id) localStorage.setItem('cartId', String(id));
};

const cartApi = {
  async getCart() {
    const { data } = await client.get('/cart');
    const normalized = normalize(data);
    // ✅ ha a backend visszaad id-t, tartsuk szinkronban
    saveCartIdIfPresent(normalized);
    return normalized;
  },

  // ✅ cartId-t elmentjük, hogy a client interceptor tudja küldeni x-cart-id headerben
  async addItem(productId, quantity) {
    const { data } = await client.post('/cart/items', { productId, quantity });
    const normalized = normalize(data);
    saveCartIdIfPresent(normalized);
    return normalized;
  },

  async updateItem(cartItemId, quantity) {
    const { data } = await client.put(`/cart/items/${cartItemId}`, { quantity });
    const normalized = normalize(data);
    saveCartIdIfPresent(normalized);
    return normalized;
  },

  async removeItem(cartItemId) {
    const { data } = await client.delete(`/cart/items/${cartItemId}`);
    const normalized = normalize(data);
    // ha üresre üríted a cartot, ettől még lehet ugyanaz az id — itt nem törlünk automatikusan
    saveCartIdIfPresent(normalized);
    return normalized;
  },
};

export default cartApi;
