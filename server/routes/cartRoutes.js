import { Router } from "express";
import CartController from "../controllers/CartController.js";

const router = Router();

/*
  Cart flow:
  - GET /api/cart → user cart vagy anon session cart
  (Items CRUD külön routerben: /api/cart/items)
*/

router.get("/", CartController.getUserCart);

export default router;
