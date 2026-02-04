import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

// Explicitly check hotel_app (current DB_NAME)
const config = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    port: process.env.DB_PORT || 3306,
    password: process.env.DB_PASSWORD || "",
    database: "hotel_app"
};

async function check() {
    console.log("Checking 'hotel_app.users' for 'points' column...");
    let connection;
    try {
        connection = await mysql.createConnection(config);
        console.log("Connected to matches.");

        const [cols] = await connection.query("SHOW COLUMNS FROM users LIKE 'points'");
        if (cols.length > 0) {
            console.log("SUCCESS: 'points' column FOUND.");
            console.log("Current Value for User 1:");
            const [rows] = await connection.query("SELECT id, name, points FROM users LIMIT 1");
            console.log(rows);
        } else {
            console.log("FAILURE: 'points' column MISSING.");
            // Attempt fix
            console.log("Attempting to add column...");
            await connection.query("ALTER TABLE users ADD COLUMN points BIGINT DEFAULT 0");
            console.log("Column added.");
        }

    } catch (err) {
        console.error("Check failed:", err.message);
    } finally {
        if (connection) await connection.end();
    }
}

check();
