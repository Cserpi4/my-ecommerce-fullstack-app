import { Router } from "express";
import CartItemController from "../controllers/CartItemController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

router.use(authMiddleware.optionalProtect);

router.post("/", CartItemController.addItem);
router.put("/:cartItemId", CartItemController.updateItem);
router.delete("/:cartItemId", CartItemController.removeItem);

export default router;
