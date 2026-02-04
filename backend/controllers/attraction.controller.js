import pool from "../config/db.js";

// =========================
// GET ALL ATTRACTIONS
// =========================
export const listAttractions = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM attractions ORDER BY id DESC");

        // Parse amenities JSON for each attraction
        const attractions = rows.map(attraction => ({
            ...attraction,
            amenities: typeof attraction.amenities === 'string'
                ? JSON.parse(attraction.amenities)
                : attraction.amenities || []
        }));

        res.json(attractions);
    } catch (err) {
        console.error("DB error:", err);
        res.status(500).json({ error: "Database error" });
    }
};

// =========================
// GET ONE ATTRACTION
// =========================
export const getAttraction = async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM attractions WHERE id = ?",
            [req.params.id]
        );

        if (rows.length === 0)
            return res.status(404).json({ error: "Attraction not found" });

        const attraction = {
            ...rows[0],
            amenities: typeof rows[0].amenities === 'string'
                ? JSON.parse(rows[0].amenities)
                : rows[0].amenities || []
        };

        res.json(attraction);
    } catch (err) {
        console.error("DB error:", err);
        res.status(500).json({ error: "Database error" });
    }
};

// =========================
// CREATE ATTRACTION (Admin)
// =========================
export const createAttraction = async (req, res) => {
    const {
        name, city, price, description, image, category, duration,
        latitude, longitude, address, rating, amenities, opening_hours,
        is_flash_sale, discount_percent
    } = req.body;

    try {
        const amenitiesJson = Array.isArray(amenities) ? JSON.stringify(amenities) : amenities;

        const [result] = await pool.query(
            `INSERT INTO attractions 
      (name, city, price, description, image, category, duration, latitude, longitude, address, rating, amenities, opening_hours, is_flash_sale, discount_percent) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, city, price, description, image, category || 'nature', duration || '2-3 hours',
                latitude, longitude, address, rating || 4.5, amenitiesJson, opening_hours || '08:00 - 17:00',
                is_flash_sale || false, discount_percent || 0]
        );

        res.status(201).json({
            id: result.insertId,
            message: "Attraction created successfully"
        });
    } catch (err) {
        console.error("Insert error:", err);
        res.status(500).json({ error: "Create attraction failed" });
    }
};

// =========================
// UPDATE ATTRACTION (Admin)
// =========================
export const updateAttraction = async (req, res) => {
    const {
        name, city, price, description, image, category, duration,
        latitude, longitude, address, rating, amenities, opening_hours,
        is_flash_sale, discount_percent
    } = req.body;

    try {
        const amenitiesJson = Array.isArray(amenities) ? JSON.stringify(amenities) : amenities;

        const [result] = await pool.query(
            `UPDATE attractions SET 
      name=?, city=?, price=?, description=?, image=?, category=?, duration=?,
      latitude=?, longitude=?, address=?, rating=?, amenities=?, opening_hours=?,
      is_flash_sale=?, discount_percent=?
      WHERE id=?`,
            [name, city, price, description, image, category, duration,
                latitude, longitude, address, rating, amenitiesJson, opening_hours,
                is_flash_sale, discount_percent, req.params.id]
        );

        res.json({ updated: result.affectedRows });
    } catch (err) {
        console.error("Update error:", err);
        res.status(500).json({ error: "Update failed" });
    }
};

// =========================
// DELETE ATTRACTION (Admin)
// =========================
export const deleteAttraction = async (req, res) => {
    try {
        const [result] = await pool.query(
            "DELETE FROM attractions WHERE id=?",
            [req.params.id]
        );

        res.json({ deleted: result.affectedRows });
    } catch (err) {
        console.error("Delete error:", err);
        res.status(500).json({ error: "Delete failed" });
    }
};

// =========================
// BOOK ATTRACTION
// =========================
export const bookAttraction = async (req, res) => {
    const attractionId = req.params.id;
    const {
        userId, visitDate, tickets, paymentMethod,
        guestName, guestEmail, guestPhone, notes
    } = req.body;

    if (!userId || !visitDate || !tickets) {
        return res.status(400).json({ error: "Missing required fields: userId, visitDate, tickets" });
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // Get attraction details
        const [attractions] = await connection.query(
            "SELECT * FROM attractions WHERE id = ?",
            [attractionId]
        );

        if (attractions.length === 0) {
            await connection.rollback();
            return res.status(404).json({ error: "Attraction not found" });
        }

        const attraction = attractions[0];

        // Calculate price with discount
        let pricePerTicket = parseFloat(attraction.price);
        if (attraction.is_flash_sale && attraction.discount_percent > 0) {
            pricePerTicket = pricePerTicket * (1 - attraction.discount_percent / 100);
        }

        const totalPrice = pricePerTicket * parseInt(tickets);

        // Calculate loyalty points (1 point per 10000 IDR spent)
        const pointsEarned = Math.floor(totalPrice / 10000);

        // Insert booking
        const [bookingResult] = await connection.query(
            `INSERT INTO attraction_bookings 
      (user_id, attraction_id, visit_date, tickets, total_price, payment_method, points_earned, guest_name, guest_email, guest_phone, notes, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed')`,
            [userId, attractionId, visitDate, tickets, totalPrice, paymentMethod, pointsEarned, guestName, guestEmail, guestPhone, notes]
        );

        // Update user's loyalty points
        await connection.query(
            "UPDATE users SET points = COALESCE(points, 0) + ? WHERE id = ?",
            [pointsEarned, userId]
        );

        await connection.commit();

        res.status(201).json({
            id: bookingResult.insertId,
            message: "Booking successful",
            booking: {
                id: bookingResult.insertId,
                attractionId,
                attractionName: attraction.name,
                visitDate,
                tickets,
                totalPrice,
                pointsEarned,
                status: 'confirmed'
            }
        });

    } catch (err) {
        await connection.rollback();
        console.error("Booking error:", err);
        res.status(500).json({ error: "Booking failed" });
    } finally {
        connection.release();
    }
};

// =========================
// GET USER'S ATTRACTION BOOKINGS
// =========================
export const getUserAttractionBookings = async (req, res) => {
    const { userId } = req.params;

    try {
        const [rows] = await pool.query(
            `SELECT ab.*, a.name as attraction_name, a.image, a.city, a.category
       FROM attraction_bookings ab
       JOIN attractions a ON ab.attraction_id = a.id
       WHERE ab.user_id = ?
       ORDER BY ab.created_at DESC`,
            [userId]
        );

        res.json(rows);
    } catch (err) {
        console.error("Get bookings error:", err);
        res.status(500).json({ error: "Failed to get bookings" });
    }
};

// =========================
// GET ATTRACTION BY CITY
// =========================
export const getAttractionsByCity = async (req, res) => {
    const { city } = req.params;

    try {
        const [rows] = await pool.query(
            "SELECT * FROM attractions WHERE city = ? ORDER BY rating DESC",
            [city]
        );

        const attractions = rows.map(attraction => ({
            ...attraction,
            amenities: typeof attraction.amenities === 'string'
                ? JSON.parse(attraction.amenities)
                : attraction.amenities || []
        }));

        res.json(attractions);
    } catch (err) {
        console.error("DB error:", err);
        res.status(500).json({ error: "Database error" });
    }
};

// =========================
// GET FLASH SALE ATTRACTIONS
// =========================
export const getFlashSaleAttractions = async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM attractions WHERE is_flash_sale = TRUE ORDER BY discount_percent DESC"
        );

        const attractions = rows.map(attraction => ({
            ...attraction,
            amenities: typeof attraction.amenities === 'string'
                ? JSON.parse(attraction.amenities)
                : attraction.amenities || []
        }));

        res.json(attractions);
    } catch (err) {
        console.error("DB error:", err);
        res.status(500).json({ error: "Database error" });
    }
};
