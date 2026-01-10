import ProductModel from "../models/ProductModel.js";
import uploadService from "./uploadService.js";

const productService = {
  async getAllProducts() {
    return ProductModel.findAll();
  },

  async getProductById(id) {
    return ProductModel.findById(id);
  },

  async createProduct({ name, description, price, imagePath }) {
    return ProductModel.create({
      name,
      description,
      price,
      imageUrl: imagePath,
      stock: null, // ha nálatok nincs, maradhat null
    });
  },

  async updateProduct(id, data) {
    return ProductModel.update(id, data);
  },

  async deleteProduct(id) {
    const product = await ProductModel.findById(id);
    if (!product) throw new Error("Product not found");

    if (product.image) {
      await uploadService.deleteFile(product.image);
    }

    await ProductModel.delete(id);
    return true;
  },
};

export default productService;
