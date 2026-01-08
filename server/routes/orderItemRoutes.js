import express from 'express';
import orderItemController from '../controllers/orderItemController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/:orderId', orderItemController.getOrderItems);
router.post('/', orderItemController.addOrderItem);
router.delete('/:orderItemId', orderItemController.removeOrderItem);

export default router;
