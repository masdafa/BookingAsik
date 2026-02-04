import express from "express";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import {
    listAttractions,
    getAttraction,
    createAttraction,
    updateAttraction,
    deleteAttraction,
    bookAttraction,
    getUserAttractionBookings,
    getAttractionsByCity,
    getFlashSaleAttractions
} from "../controllers/attraction.controller.js";

const router = express.Router();

// Public routes
router.get("/", listAttractions);
router.get("/flash-sale", getFlashSaleAttractions);
router.get("/city/:city", getAttractionsByCity);
router.get("/:id", getAttraction);

// Authenticated routes
router.post("/:id/book", requireAuth, bookAttraction);
router.get("/user/:userId/bookings", requireAuth, getUserAttractionBookings);

// Admin-only routes
router.post("/", requireAuth, requireRole('admin'), createAttraction);
router.put("/:id", requireAuth, requireRole('admin'), updateAttraction);
router.delete("/:id", requireAuth, requireRole('admin'), deleteAttraction);

export default router;
