import { Router } from "express";
import { getAllUsers, getStats } from "../controllers/adminController";
import { protect, requireAdmin } from "../middleware/auth";

const router = Router();

router.use(protect, requireAdmin);

router.get("/users", getAllUsers);
router.get("/stats", getStats);

export default router;