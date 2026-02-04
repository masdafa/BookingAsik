import pool from "../config/db.js";

// GET ALL BOOKINGS (user context)
export const getAllBookings = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT b.*, h.name AS hotel_name, h.image, h.city
      FROM hotel_booking.bookings b
      JOIN hotels h ON b.hotel_id = h.id
      WHERE b.user_id = ?
      ORDER BY b.id DESC
    `, [req.user.id]);

    // Format output untuk frontend
    const formatted = rows.map(row => ({
      id: row.id,
      hotel_name: row.hotel_name,
      city: row.city,
      image: row.image,
      start_date: row.start_date,
      end_date: row.end_date,
      total_price: row.total_price,
      status: 'confirmed'
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "DB Error" });
  }
};

// GET ALL BOOKINGS (ADMIN context)
export const getAllBookingsAdmin = async (req, res) => {
  try {
    // Join hotels AND users
    const [rows] = await pool.query(`
      SELECT b.*, h.name AS hotel_name, u.name AS user_name, u.email AS user_email
      FROM hotel_booking.bookings b
      JOIN hotels h ON b.hotel_id = h.id
      JOIN hotel_app.users u ON b.user_id = u.id
      ORDER BY b.id DESC
    `);

    const formatted = rows.map(row => ({
      id: row.id,
      hotelName: row.hotel_name,
      userName: row.user_name,
      userEmail: row.user_email,
      start_date: row.start_date,
      end_date: row.end_date,
      total_price: row.total_price,
      status: 'confirmed'
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "DB Error: " + err.message });
  }
};

// CREATE BOOKING
export const createBooking = async (req, res) => {
  const { user_id, hotel_id, check_in, check_out, total_price, rooms, voucher_id } = req.body;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Handle Voucher (if applied)
    if (voucher_id) {
      // Verify voucher ownership and status
      const [vouchers] = await connection.query(
        "SELECT id FROM user_vouchers WHERE user_id = ? AND voucher_id = ? AND is_used = 0",
        [user_id, voucher_id]
      );

      if (vouchers.length === 0) {
        throw new Error("Voucher tidak valid atau sudah digunakan");
      }

      // Mark as used
      await connection.query(
        "UPDATE user_vouchers SET is_used = 1 WHERE user_id = ? AND voucher_id = ?",
        [user_id, voucher_id]
      );
    }

    // 2. Insert Booking
    const [result] = await connection.query(
      `INSERT INTO hotel_booking.bookings(user_id, hotel_id, start_date, end_date, total_price, rooms)
       VALUES(?, ?, ?, ?, ?, ?)`,
      [user_id, hotel_id, check_in, check_out, total_price, rooms || 1]
    );

    // 3. Update Points (Earn points from paid amount)
    const earnedPoints = Math.floor(total_price / 10000);

    if (earnedPoints > 0) {
      await connection.query(
        "UPDATE users SET points = points + ? WHERE id = ?",
        [earnedPoints, user_id]
      );
    }

    await connection.commit();
    res.json({ id: result.insertId, message: "Booking created", pointsEarned: earnedPoints });

  } catch (err) {
    await connection.rollback();
    console.error("CREATE BOOKING ERROR:", err);
    res.status(500).json({ message: "DB Error: " + err.message });
  } finally {
    connection.release();
  }
};

// UPDATE BOOKING
export const updateBooking = async (req, res) => {
  const { id } = req.params;
  const { check_in, check_out, total_price } = req.body;

  try {
    await pool.query(
      `UPDATE hotel_booking.bookings SET start_date =?, end_date =?, total_price =? WHERE id =? `,
      [check_in, check_out, total_price, id]
    );

    res.json({ message: "Booking updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "DB Error" });
  }
};

// DELETE BOOKING
export const deleteBooking = async (req, res) => {
  try {
    await pool.query("DELETE FROM hotel_booking.bookings WHERE id=?", [req.params.id]);
    res.json({ message: "Booking deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "DB Error" });
  }
};
