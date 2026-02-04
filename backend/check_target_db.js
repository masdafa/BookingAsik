import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const config = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    port: process.env.DB_PORT || 3306,
    password: process.env.DB_PASSWORD || "",
    database: "hotel_booking" // We are explicitly checking this DB
};

async function checkTargetDB() {
    console.log("Checking target database 'hotel_booking'...");
    let connection;
    try {
        connection = await mysql.createConnection(config);
        console.log("Connected to hotel_booking.");

        // Check Tables
        const [tables] = await connection.query("SHOW TABLES");
        console.log("Tables:", tables.map(t => Object.values(t)[0]).join(", "));

        // Check Users Columns (for points)
        try {
            const [uCols] = await connection.query("SHOW COLUMNS FROM users LIKE 'points'");
            if (uCols.length) console.log("Users table has 'points' column.");
            else console.log("WARNING: Users table MISSING 'points' column.");
        } catch (e) { console.log("Users table likely missing."); }

        // Check Bookings Table
        try {
            const [bCols] = await connection.query("SHOW COLUMNS FROM bookings");
            console.log("Bookings table columns:", bCols.map(c => c.Field).join(", "));
        } catch (e) { console.log("WARNING: Bookings table missing or invalid."); }


    } catch (err) {
        console.error("Check failed:", err.message);
    } finally {
        if (connection) await connection.end();
    }
}

checkTargetDB();
