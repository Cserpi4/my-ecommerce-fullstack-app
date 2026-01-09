import express from "express";
import CartItemController from "../controllers/cartItemController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// anon is mehet, token esetén req.user beáll
router.use(authMiddleware.optionalProtect);

router.post("/", CartItemController.addItem);
router.put("/:cartItemId", CartItemController.updateItem);
router.delete("/:cartItemId", CartItemController.removeItem);

export default router;
