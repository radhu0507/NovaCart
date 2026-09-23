import { Router } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";
import { protect, requireAdmin } from "../middleware/auth";

const router = Router();

router.get("/", getProducts);
router.get("/:id", getProductById);

router.post("/", protect, requireAdmin, createProduct);
router.put("/:id", protect, requireAdmin, updateProduct);
router.delete("/:id", protect, requireAdmin, deleteProduct);

export default router;