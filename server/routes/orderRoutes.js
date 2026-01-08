import express from 'express';
import orderController from '../controllers/orderController.js';
// import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();
// router.use(authMiddleware.protect);

router.post('/', orderController.createOrder);
router.get('/:orderId', orderController.getOrder);

export default router;
