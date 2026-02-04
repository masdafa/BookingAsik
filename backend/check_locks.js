import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const config = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    port: process.env.DB_PORT || 3306,
    password: process.env.DB_PASSWORD || "",
    database: "information_schema" // Use info schema to see full process list
};

async function check() {
    console.log("Checking Process List...");
    let connection;
    try {
        connection = await mysql.createConnection(config);
        const [rows] = await connection.query("SHOW PROCESSLIST");

        console.log("Active Processes:");
        rows.forEach(row => {
            if (row.Command !== 'Sleep' || row.Time > 10) { // Show relevant ones
                console.log(`ID: ${row.Id}, User: ${row.User}, Host: ${row.Host}, DB: ${row.db}, Command: ${row.Command}, Time: ${row.Time}, Info: ${row.Info}`);
            }
        });

    } catch (err) {
        console.error("Check failed:", err.message);
    } finally {
        if (connection) await connection.end();
    }
}

check();
