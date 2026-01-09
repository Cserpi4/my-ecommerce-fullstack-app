import express from 'express';
import cartController from '../controllers/cartController.js';

const router = express.Router();

/*
  Cart flow:
  - GET    /api/cart        → user cart vagy anon session cart
  - POST   /api/cart/items → item hozzáadás (cart automatikusan létrejön)
  - DELETE /api/cart/items/:cartItemId → item törlés
*/

router.get('/', cartController.getUserCart);
router.post('/items', cartController.addItem);
router.delete('/items/:cartItemId', cartController.removeItem);

export default router;
