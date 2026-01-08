import express from 'express';
import cartItemController from '../controllers/cartItemController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();
router.use(authMiddleware);

router.post('/', cartItemController.addItem);
router.put('/:cartItemId', cartItemController.updateItem);
router.delete('/:cartItemId', cartItemController.removeItem);

export default router;
