import { Router } from "express";
import OrderItemController from "../controllers/OrderItemController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/:orderId", OrderItemController.getOrderItems);
router.post("/", OrderItemController.addOrderItem);
router.delete("/:orderItemId", OrderItemController.removeOrderItem);

export default router;
