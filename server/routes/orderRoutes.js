import express from "express";
import OrderController from "../controllers/OrderController.js";
// import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// router.use(authMiddleware.protect);

router.post("/", OrderController.createOrder);
router.get("/:orderId", OrderController.getOrder);

export default router;
