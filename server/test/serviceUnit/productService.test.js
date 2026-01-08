// server/test/serviceUnit/productService.test.js
import productService from '../../services/productService.js';

describe('Product Service Unit Tests', () => {
  let testProduct;

  beforeAll(async () => {
    // Ha van seed adat, lekérhetjük az első terméket tesztelésre
    const products = await productService.getAllProducts();
    testProduct = products[0];
  });

  test('should fetch all products', async () => {
    const products = await productService.getAllProducts();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
  });

  test('should fetch a product by id', async () => {
    const product = await productService.getProductById(testProduct.id);
    expect(product).toBeDefined();
    expect(product.id).toBe(testProduct.id);
    expect(product.name).toBe(testProduct.name);
  });

  test('should throw an error for invalid product id', async () => {
    await expect(productService.getProductById(-1)).rejects.toThrow();
  });
});
