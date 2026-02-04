import pool from "../config/db.js";

// GET ALL AVAILABLE VOUCHERS
export const getVouchers = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM vouchers ORDER BY points_cost ASC");
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "DB Error" });
    }
};

// GET MY VOUCHERS
export const getMyVouchers = async (req, res) => {
    try {
        const [rows] = await pool.query(`
      SELECT uv.id, v.code, v.description, v.discount_amount, uv.is_used 
      FROM user_vouchers uv
      JOIN vouchers v ON uv.voucher_id = v.id
      WHERE uv.user_id = ?
      ORDER BY uv.id DESC
    `, [req.user.id]);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "DB Error" });
    }
};

// REDEEM VOUCHER
export const redeemVoucher = async (req, res) => {
    const { voucherId } = req.body;
    const userId = req.user.id;
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Get Voucher Cost
        const [vouchers] = await connection.query("SELECT * FROM vouchers WHERE id = ?", [voucherId]);
        if (vouchers.length === 0) {
            throw new Error("Voucher not found");
        }
        const voucher = vouchers[0];

        // 2. Check User Points
        const [users] = await connection.query("SELECT points FROM users WHERE id = ?", [userId]);
        const userPoints = users[0].points; // Use points from DB, not token

        if (userPoints < voucher.points_cost) {
            throw new Error("Poin tidak cukup");
        }

        // 3. Deduct Points
        await connection.query("UPDATE users SET points = points - ? WHERE id = ?", [voucher.points_cost, userId]);

        // 4. Add Voucher to User
        await connection.query("INSERT INTO user_vouchers (user_id, voucher_id) VALUES (?, ?)", [userId, voucherId]);

        await connection.commit();

        // Return remaining points to update frontend
        res.json({ message: "Voucher berhasil ditukar!", remainingPoints: userPoints - voucher.points_cost });

    } catch (err) {
        await connection.rollback();
        console.error("Redeem Error:", err);
        res.status(400).json({ message: err.message || "Redeem failed" });
    } finally {
        connection.release();
    }
};
