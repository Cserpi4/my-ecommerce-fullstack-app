import express from 'express';
import cartController from '../controllers/cartController.js';

const router = express.Router();

/*
  Cart flow:
  - GET /api/cart → user cart vagy anon session cart
  (Items CRUD külön routerben: /api/cart/items)
*/

router.get('/', cartController.getUserCart);

export default router;
