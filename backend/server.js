import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { requireAuth } from "./middleware/auth.middleware.js";

dotenv.config();

import authRoutes from "./routes/auth.routes.js";
import hotelRoutes from "./routes/hotel.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import uploadLocalRoutes from "./routes/uploadLocal.routes.js";
import userRoutes from "./routes/user.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import voucherRoutes from "./routes/voucher.routes.js";
import attractionRoutes from "./routes/attraction.routes.js";

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Fix __dirname utk ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ======================================================
// 🔥 STATIC FILES — supaya bisa akses /hotels/hotel1.jpg
// ======================================================
app.use("/hotels", express.static(path.join(__dirname, "public/hotels")));

// ======================================================
// ROUTES
// ======================================================
app.use("/api/auth", authRoutes); // Public routes: login/register
app.use("/api/hotels", hotelRoutes); // Public GET, Admin-only management
app.use("/api/bookings", bookingRoutes); // Only authenticated
app.use("/api/upload", uploadRoutes);    // Only authenticated (Cloudinary)
app.use("/api/upload-local", uploadLocalRoutes); // Local file upload
app.use("/api/users", userRoutes);       // Admin only
app.use("/api/dashboard", dashboardRoutes); // Admin dashboard stats
app.use("/api/vouchers", voucherRoutes);
app.use("/api/attractions", attractionRoutes); // Attractions API

app.get("/", (req, res) => {
  res.json({ status: "API OK" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () => console.log("Backend running on port", PORT));
