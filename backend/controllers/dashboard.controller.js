import pool from "../config/db.js";

// GET DASHBOARD STATISTICS
export const getDashboardStats = async (req, res) => {
  try {
    // Total Hotels
    const [hotelCount] = await pool.query("SELECT COUNT(*) as total FROM hotels");
    const totalHotels = hotelCount[0].total;

    // Bookings Today (menggunakan start_date = hari ini)
    const today = new Date().toISOString().split("T")[0];
    const [bookingToday] = await pool.query(
      "SELECT COUNT(*) as total FROM bookings WHERE DATE(start_date) = ?",
      [today]
    );
    const bookingsToday = bookingToday[0].total;

    // Total Revenue (SUM dari total_price semua bookings)
    const [revenue] = await pool.query(
      "SELECT COALESCE(SUM(total_price), 0) as total FROM bookings"
    );
    const totalRevenue = revenue[0].total || 0;

    // Recent Activities (5 booking terbaru dengan info user & hotel)
    const [recentBookings] = await pool.query(`
      SELECT 
        b.id,
        b.start_date,
        b.end_date,
        b.total_price,
        u.name AS userName,
        h.name AS hotelName
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN hotels h ON b.hotel_id = h.id
      ORDER BY b.id DESC
      LIMIT 5
    `);

    res.json({
      totalHotels,
      bookingsToday,
      totalRevenue,
      recentBookings,
    });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

