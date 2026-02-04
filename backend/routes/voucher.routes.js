import express from "express";
import { getVouchers, getMyVouchers, redeemVoucher } from "../controllers/voucher.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", getVouchers);
router.get("/my", getMyVouchers);
router.post("/redeem", redeemVoucher);

export default router;
