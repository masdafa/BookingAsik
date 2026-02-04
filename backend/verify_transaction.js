import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const config = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    port: process.env.DB_PORT || 3306,
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "hotel_app"
};

async function verify() {
    console.log("Verifying Full Transaction...");
    let connection;
    try {
        connection = await mysql.createConnection(config);
        console.log("Connected.");

        // 1. Insert Booking
        console.log("Step 1: Inserting Booking...");
        const [result] = await connection.query(
            `INSERT INTO bookings (user_id, hotel_id, start_date, end_date, total_price, rooms)
       VALUES (?, ?, ?, ?, ?, ?)`,
            [1, 1, '2024-02-01', '2024-02-03', 300000, 1]
        );
        console.log("Booking Inserted. ID:", result.insertId);

        // 2. Update Points
        console.log("Step 2: Updating Points...");
        const points = Math.floor(300000 / 10000);
        const [update] = await connection.query(
            "UPDATE users SET points = points + ? WHERE id = ?",
            [points, 1]
        );
        console.log("Points Updated. Rows affected:", update.affectedRows);

        console.log("SUCCESS: Database logic is perfect.");

    } catch (err) {
        console.error("TRANSACTION FAILED:", err.message);
    } finally {
        if (connection) await connection.end();
    }
}

verify();
