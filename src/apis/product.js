import client from "./client.js";

const productApi = {
  async fetchProducts() {
    try {
      const response = await client.get("/products");
      return response.data.data;
    } catch (err) {
      console.error("Error fetching products:", err);
      throw err;
    }
  },

  async fetchProductById(id) {
    try {
      const response = await client.get(`/products/${id}`);
      return response.data.data;
    } catch (err) {
      console.error(`Error fetching product ${id}:`, err);
      throw err;
    }
  },
};

export default productApi;
