import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const config = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    port: process.env.DB_PORT || 3306,
    password: process.env.DB_PASSWORD || "",
    database: "hotel_booking"
};

async function check() {
    console.log("Final Hotel Check...");
    let connection;
    try {
        connection = await mysql.createConnection(config);
        const [rows] = await connection.query("SELECT id, name, price FROM hotels");
        console.log(`Found ${rows.length} hotels.`);
        rows.forEach(h => console.log(`- ${h.name} (${h.price})`));
    } catch (err) {
        console.error("Check failed:", err.message);
    } finally {
        if (connection) await connection.end();
    }
}

check();
