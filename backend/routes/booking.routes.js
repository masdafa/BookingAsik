import express from "express";
import {
  getAllBookings,
  getAllBookingsAdmin,
  createBooking,
  updateBooking,
  deleteBooking,
} from "../controllers/booking.controller.js";
import { sendBookingEmail } from "../services/email.service.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";

const router = express.Router();

// 🔧 Endpoint PUBLIK diletakkan di awal (sebelum middleware auth)
router.post("/send-booking-email/public", async (req, res) => {
  try {
    const { to, booking } = req.body;
    
    console.log('📧 [PUBLIC] Attempting to send email to:', to);
    console.log('📧 [PUBLIC] Booking data:', JSON.stringify(booking, null, 2));
    
    // Validasi input
    if (!to || !booking) {
      console.log('❌ [PUBLIC] Missing required fields: to or booking');
      return res.status(400).json({ 
        message: "Email address and booking data are required" 
      });
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      console.log('❌ [PUBLIC] Invalid email format:', to);
      return res.status(400).json({ 
        message: "Invalid email format" 
      });
    }

    // Validasi data booking minimal
    if (!booking.id || !booking.hotel_name || !booking.customer_name) {
      console.log('❌ [PUBLIC] Missing required booking fields:', {
        id: booking.id,
        hotel_name: booking.hotel_name,
        customer_name: booking.customer_name
      });
      return res.status(400).json({ 
        message: "Missing required booking information" 
      });
    }

    console.log('📧 [PUBLIC] Calling sendBookingEmail service...');
    
    // Kirim email
    const result = await sendBookingEmail(to, booking);
    
    console.log('✅ [PUBLIC] Email sent successfully to:', to);
    console.log('✅ [PUBLIC] Email service result:', result);
    
    res.status(200).json({ 
      message: "Booking confirmation email sent successfully",
      result: result
    });
  } catch (error) {
    console.error("❌ [PUBLIC] Error sending booking email:", error);
    console.error("❌ [PUBLIC] Error stack:", error.stack);
    
    res.status(500).json({ 
      message: "Failed to send booking confirmation email",
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// 🔧 Endpoint test juga diletakkan di awal
router.get("/test-email-config", async (req, res) => {
  try {
    console.log('🧪 Testing Email Configuration...');
    
    const envVars = {
      EMAILJS_SERVICE_ID: process.env.EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID: process.env.EMAILJS_TEMPLATE_ID,
      EMAILJS_PUBLIC_KEY: process.env.EMAILJS_PUBLIC_KEY ? 'SET' : 'NOT SET',
      EMAILJS_PRIVATE_KEY: process.env.EMAILJS_PRIVATE_KEY ? 'SET' : 'NOT SET'
    };
    
    console.log('🧪 Environment Variables:', envVars);
    
    res.status(200).json({ 
      message: "Email configuration test",
      envVars: envVars
    });
  } catch (error) {
    console.error("❌ Test config error:", error);
    res.status(500).json({ 
      message: "Failed to test email configuration",
      error: error.message 
    });
  }
});

// 🔐 Sekarang baru terapkan middleware auth untuk route yang memerlukan autentikasi
router.use(requireAuth);

// Routes untuk user biasa (sudah terproteksi auth)
router.get("/", getAllBookings);
router.post("/", createBooking);
router.put("/:id", updateBooking);
router.delete("/:id", deleteBooking);

// Routes khusus admin
router.get("/admin", requireRole("admin"), getAllBookingsAdmin);

// Endpoint untuk mengirim email booking - user authenticated
router.post("/send-booking-email", async (req, res) => {
  // ... kode yang sama seperti sebelumnya
});

// Endpoint untuk reminder dan cancellation (admin only)
router.post("/send-reminder/:bookingId", requireRole("admin"), async (req, res) => {
  // ... kode yang sama
});

router.post("/send-cancellation/:bookingId", requireRole("admin"), async (req, res) => {
  // ... kode yang sama
});

export default router;
