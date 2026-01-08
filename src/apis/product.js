import axios from './client.js';

// Termékek lekérése
export const fetchProducts = async () => {
  try {
    const response = await axios.get('/products');
    return response.data.data;
  } catch (err) {
    console.error('Error fetching products:', err);
    throw err;
  }
};

// Egy termék lekérése ID alapján
export const fetchProductById = async id => {
  try {
    const response = await axios.get(`/products/${id}`);
    return response.data.data;
  } catch (err) {
    console.error(`Error fetching product ${id}:`, err);
    throw err;
  }
};
