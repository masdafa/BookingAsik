import mysql from "mysql2/promise";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// Explicitly target hotel_booking
const config = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    port: process.env.DB_PORT || 3306,
    password: process.env.DB_PASSWORD || "",
    database: "hotel_booking",
    multipleStatements: true
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrate() {
    console.log("Starting Full Migration on 'hotel_booking'...");
    let connection;
    try {
        connection = await mysql.createConnection(config);
        console.log("Connected.");

        // Force reset: DROP tables first
        console.log("Dropping old tables...");
        await connection.query("SET FOREIGN_KEY_CHECKS = 0");
        await connection.query("DROP TABLE IF EXISTS bookings");
        await connection.query("DROP TABLE IF EXISTS reviews");
        await connection.query("DROP TABLE IF EXISTS hotel_photos");
        await connection.query("DROP TABLE IF EXISTS hotels");
        await connection.query("DROP TABLE IF EXISTS users");
        await connection.query("SET FOREIGN_KEY_CHECKS = 1");

        const schemaPath = path.join(__dirname, "schema.sql");
        const schemaSql = fs.readFileSync(schemaPath, "utf8");

        console.log("Executing schema.sql...");
        await connection.query(schemaSql);

        // Manual check for 'points' column in users just in case
        try {
            await connection.query("ALTER TABLE users ADD COLUMN points BIGINT DEFAULT 0");
            console.log("Added points column manually.");
        } catch (e) { console.log("points column likely exists."); }

        // Manual check for 'rooms' in bookings
        try {
            // Drop existing bookings table if it has wrong columns to force recreation or alter it
            // Simpler to just alter for now
            await connection.query("ALTER TABLE bookings ADD COLUMN rooms INT DEFAULT 1");
            await connection.query("ALTER TABLE bookings CHANGE check_in start_date DATE");
            await connection.query("ALTER TABLE bookings CHANGE check_out end_date DATE");
            console.log("Fixed bookings table columns.");
        } catch (e) { console.log("Bookings table check finished."); }


        console.log("Migration Complete.");

    } catch (err) {
        console.error("Migration failed:", err.message);
    } finally {
        if (connection) await connection.end();
    }
}

migrate();
