import { Router } from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/orderController";
import { protect, requireAdmin } from "../middleware/auth";

const router = Router();

router.post("/", protect, createOrder);
router.get("/", protect, getOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/status", protect, requireAdmin, updateOrderStatus);

export default router;