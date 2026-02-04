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

async function check() {
    console.log("Checking bookings table...");
    let connection;
    try {
        connection = await mysql.createConnection(config);
        const [columns] = await connection.query("SHOW COLUMNS FROM bookings");
        console.log("Columns in 'bookings' table:");
        columns.forEach(c => console.log(`- ${c.Field} (${c.Type})`));
    } catch (err) {
        console.error("Check failed:", err.message);
    } finally {
        if (connection) await connection.end();
    }
}

check();
