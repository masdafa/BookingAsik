import express from "express";
import {
  listHotels,
  getHotel,
  createHotel,
  updateHotel,
  deleteHotel,
  updateHotelCoordinates,
  getHotelAvailability,
  getHotelReviews,
  createHotelReview
} from "../controllers/hotel.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", listHotels);
router.get("/:id", getHotel);
// Hanya admin yang boleh create/update/delete hotel
router.post("/", requireAuth, requireRole("admin"), createHotel);
router.put("/:id", requireAuth, requireRole("admin"), updateHotel);
router.delete("/:id", requireAuth, requireRole("admin"), deleteHotel);
// Endpoint untuk update koordinat hotel yang sudah ada (admin only)
router.post("/update-coordinates", requireAuth, requireRole("admin"), updateHotelCoordinates);

// Availability
router.get("/:id/availability", getHotelAvailability);

// Reviews
router.get("/:id/reviews", getHotelReviews);
router.post("/:id/reviews", requireAuth, createHotelReview);

export default router;
