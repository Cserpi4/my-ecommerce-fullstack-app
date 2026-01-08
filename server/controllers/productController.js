import productService from '../services/productService.js';
import uploadService from '../services/uploadService.js';

// Termék lista lekérése
const getProducts = async (req, res, next) => {
  try {
    const products = await productService.getAllProducts();
    res.json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
};

// Egy termék lekérése ID alapján
const getProduct = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// Új termék létrehozása
const createProduct = async (req, res, next) => {
  try {
    let imagePath = null;
    if (req.file) {
      imagePath = await uploadService.processFile(req.file);
    }

    const newProduct = await productService.createProduct({
      ...req.body,
      imagePath,
    });

    res.status(201).json({ success: true, data: newProduct });
  } catch (err) {
    next(err);
  }
};

// Termék frissítése
const updateProduct = async (req, res, next) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      const imagePath = await uploadService.processFile(req.file);
      updateData.image = imagePath;
    }

    const updatedProduct = await productService.updateProduct(req.params.id, updateData);
    res.json({ success: true, data: updatedProduct });
  } catch (err) {
    next(err);
  }
};

// Termék törlése
const deleteProduct = async (req, res, next) => {
  try {
    await productService.deleteProduct(req.params.id);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export default {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
