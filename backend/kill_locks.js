import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const config = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    port: process.env.DB_PORT || 3306,
    password: process.env.DB_PASSWORD || "",
    database: "information_schema"
};

async function kill() {
    console.log("Killing Stuck Processes...");
    let connection;
    try {
        connection = await mysql.createConnection(config);
        const [rows] = await connection.query("SHOW PROCESSLIST");

        for (const row of rows) {
            if (row.Command === 'Query' && row.Time > 5 && row.Info !== 'SHOW PROCESSLIST') {
                console.log(`Killing ID ${row.Id} (${row.Info})...`);
                await connection.query(`KILL ${row.Id}`);
            }
        }
        console.log("All stuck processes killed.");

    } catch (err) {
        console.error("Kill failed:", err.message);
    } finally {
        if (connection) await connection.end();
    }
}

kill();
