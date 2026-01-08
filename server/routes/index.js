import express from 'express';
import authRoutes from './authRoutes.js';
import cartRoutes from './cartRoutes.js';
import orderRoutes from './orderRoutes.js';
import userRoutes from './userRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import productRoutes from './productRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/cart', cartRoutes);
router.use('/order', orderRoutes);
router.use('/user', userRoutes);
router.use('/payment', paymentRoutes);
router.use('/products', productRoutes);

export default router;
