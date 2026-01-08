import express from 'express';
import productController from '../controllers/productController.js';
import fileUpload from '../middlewares/fileUpload.js'; // multer middleware
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Mindenki számára elérhető termékek
router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);

// Admin jogosultság szükséges a CRUD műveletekhez
router.post(
  '/',
  authMiddleware.protectAdmin,
  fileUpload.single('image'),
  productController.createProduct
);
router.put(
  '/:id',
  authMiddleware.protectAdmin,
  fileUpload.single('image'),
  productController.updateProduct
);
router.delete('/:id', authMiddleware.protectAdmin, productController.deleteProduct);

export default router;
