import express from "express";
import { getDashboardStats } from "../controllers/dashboard.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";

const router = express.Router();

// Hanya admin yang bisa akses dashboard stats
router.get("/stats", requireAuth, requireRole("admin"), getDashboardStats);

export default router;

