import express from "express";
import ProductController from "../controllers/ProductController.js";
import fileUpload from "../middlewares/fileUpload.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", ProductController.getProducts);
router.get("/:id", ProductController.getProduct);

// Admin
router.post(
  "/",
  authMiddleware.protectAdmin,
  fileUpload.single("image"),
  ProductController.createProduct
);

router.put(
  "/:id",
  authMiddleware.protectAdmin,
  fileUpload.single("image"),
  ProductController.updateProduct
);

router.delete("/:id", authMiddleware.protectAdmin, ProductController.deleteProduct);

export default router;
