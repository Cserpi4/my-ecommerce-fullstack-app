import express from 'express';
import cartController from '../controllers/cartController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Csak belépett felhasználók
// // router.use(authMiddleware.protect);

router.get('/', cartController.getUserCart);
router.post('/', cartController.createCart);
router.post('/items', cartController.addItem);
router.delete('/items/:cartItemId', cartController.removeItem);

export default router;
