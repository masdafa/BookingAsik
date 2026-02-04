import pool from "../config/db.js";
import { geocodeHotel } from "../services/geocoding.service.js";

// =========================
// GET ALL HOTELS
// =========================
export const listHotels = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM hotels ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Database error" });
  }
};

// =========================
// GET ONE HOTEL
// =========================
export const getHotel = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM hotels WHERE id = ?",
      [req.params.id]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: "Hotel not found" });

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
};

// =========================
// CREATE HOTEL
// =========================
export const createHotel = async (req, res) => {
  const { name, city, price, description, image } = req.body;

  try {
    // Auto-geocode untuk mendapatkan koordinat
    let latitude = null;
    let longitude = null;
    let address = null;

    if (name && city) {
      const geocodeResult = await geocodeHotel(name, city);
      if (geocodeResult) {
        latitude = geocodeResult.latitude;
        longitude = geocodeResult.longitude;
        address = geocodeResult.address;
      }
    }

    const [result] = await pool.query(
      "INSERT INTO hotels (name, city, price, description, image, latitude, longitude, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [name, city, price, description, image, latitude, longitude, address]
    );

    res.json({
      id: result.insertId,
      message: "Hotel created",
      coordinates: latitude && longitude ? { latitude, longitude } : null
    });
  } catch (err) {
    console.error("Insert error:", err);
    res.status(500).json({ error: "Create hotel failed" });
  }
};

// =========================
// UPDATE HOTEL
// =========================
export const updateHotel = async (req, res) => {
  const { name, city, price, description, image } = req.body;

  try {
    // Auto-geocode jika nama atau kota berubah
    let latitude = null;
    let longitude = null;
    let address = null;

    if (name && city) {
      const geocodeResult = await geocodeHotel(name, city);
      if (geocodeResult) {
        latitude = geocodeResult.latitude;
        longitude = geocodeResult.longitude;
        address = geocodeResult.address;
      }
    }

    const [result] = await pool.query(
      "UPDATE hotels SET name=?, city=?, price=?, description=?, image=?, latitude=?, longitude=?, address=? WHERE id=?",
      [name, city, price, description, image, latitude, longitude, address, req.params.id]
    );

    res.json({
      updated: result.affectedRows,
      coordinates: latitude && longitude ? { latitude, longitude } : null
    });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Update failed" });
  }
};

// =========================
// DELETE HOTEL
// =========================
export const deleteHotel = async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM hotels WHERE id=?",
      [req.params.id]
    );

    res.json({ deleted: result.affectedRows });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Delete failed" });
  }
};

// =========================
// UPDATE COORDINATES FOR EXISTING HOTELS
// =========================
export const updateHotelCoordinates = async (req, res) => {
  try {
    // Ambil semua hotel yang belum punya koordinat
    const [hotels] = await pool.query(
      "SELECT id, name, city FROM hotels WHERE latitude IS NULL OR longitude IS NULL"
    );

    let updated = 0;
    for (const hotel of hotels) {
      if (hotel.name && hotel.city) {
        const geocodeResult = await geocodeHotel(hotel.name, hotel.city);
        if (geocodeResult) {
          await pool.query(
            "UPDATE hotels SET latitude=?, longitude=?, address=? WHERE id=?",
            [geocodeResult.latitude, geocodeResult.longitude, geocodeResult.address, hotel.id]
          );
          updated++;
          // Delay untuk menghindari rate limit Nominatim (1 request per detik)
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }

    res.json({
      message: `Updated coordinates for ${updated} hotels`,
      updated
    });
  } catch (err) {
    console.error("Update coordinates error:", err);
    res.status(500).json({ error: "Update coordinates failed" });
  }
};

// =========================
// GET HOTEL AVAILABILITY (MOCK)
// =========================
export const getHotelAvailability = async (req, res) => {
  const { id } = req.params;
  const { checkIn, checkOut } = req.query;

  try {
    // Logic Mocking:
    // 1. Hitung total kamar (misal fixed 10)
    // 2. Hitung booking yang overlap dengan tanggal checkIn/checkOut
    // 3. Available = Total - Booked

    // Cek booking yang overlap
    // (start_date <= checkOut) AND (end_date >= checkIn)
    const sql = `
      SELECT COUNT(*) as bookedCount 
      FROM bookings 
      WHERE hotel_id = ? 
      AND NOT (end_date <= ? OR start_date >= ?)
    `;

    // Perhatikan parameter query: checkIn/checkOut dari frontend
    // Asumsi format YYYY-MM-DD
    const [rows] = await pool.query(sql, [id, checkIn, checkOut]);
    const bookedCount = rows[0].bookedCount;
    const totalRooms = 15; // Hardcoded total rooms
    const available = Math.max(0, totalRooms - bookedCount);

    res.json({
      rooms: available,
      roomTypes: [
        { name: "Standard", available: Math.floor(available * 0.6) },
        { name: "Deluxe", available: Math.floor(available * 0.4) }
      ]
    });

  } catch (err) {
    console.error("Availability error:", err);
    res.status(500).json({ error: "Check availability failed" });
  }
};

// =========================
// GET REVIEWS
// =========================
export const getHotelReviews = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT r.*, u.name as userName 
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.hotel_id = ?
      ORDER BY r.date DESC
    `, [req.params.id]);

    // Format response agar sesuai dengan ekspektasi frontend
    const reviews = rows.map(row => ({
      id: row.id,
      rating: row.rating,
      comment: row.comment,
      date: row.date,
      user: {
        name: row.userName
      }
    }));

    res.json(reviews);
  } catch (err) {
    console.error("Get reviews error:", err);
    res.status(500).json({ error: "Get reviews failed" });
  }
};

// =========================
// CREATE REVIEW
// =========================
export const createHotelReview = async (req, res) => {
  const { userId, rating, comment } = req.body;
  const hotelId = req.params.id;

  if (!userId || !rating) {
    return res.status(400).json({ message: "Incomplete data" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO reviews (hotel_id, user_id, rating, comment) VALUES (?, ?, ?, ?)",
      [hotelId, userId, rating, comment]
    );

    // Ambil data user untuk return
    const [userRows] = await pool.query("SELECT name FROM users WHERE id = ?", [userId]);

    res.status(201).json({
      id: result.insertId,
      hotel_id: hotelId,
      user_id: userId,
      rating,
      comment,
      date: new Date(), // Approximate return date
      user: {
        name: userRows[0]?.name || "User"
      }
    });
  } catch (err) {
    console.error("Create review error:", err);
    res.status(500).json({ message: "Failed to post review" });
  }
};
