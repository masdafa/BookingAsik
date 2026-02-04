import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

// Configuration for OLD database (Source)
const configSource = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    port: process.env.DB_PORT || 3306,
    password: process.env.DB_PASSWORD || "",
    database: "hotel_app"
};

// Configuration for NEW database (Target)
const configTarget = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    port: process.env.DB_PORT || 3306,
    password: process.env.DB_PASSWORD || "",
    database: "hotel_booking"
};

async function transfer() {
    console.log("Starting Data Transfer: hotel_app -> hotel_booking");
    let connSource, connTarget;

    try {
        // 1. Unplug from Source
        connSource = await mysql.createConnection(configSource);
        console.log("Connected to Source (hotel_app).");
        const [hotels] = await connSource.query("SELECT * FROM hotels");
        console.log(`Fetched ${hotels.length} hotels from Source.`);

        if (hotels.length === 0) {
            console.log("No data to transfer.");
            return;
        }

        // 2. Plug into Target
        connTarget = await mysql.createConnection(configTarget);
        console.log("Connected to Target (hotel_booking).");

        // 3. Clear Target
        await connTarget.query("TRUNCATE TABLE hotels");
        console.log("Cleared Target 'hotels' table.");

        // 4. Pump Data
        const query = `INSERT INTO hotels 
      (id, name, city, price, description, image, latitude, longitude, address) 
      VALUES ?`;

        // Transform data for bulk insert
        const values = hotels.map(h => [
            h.id, h.name, h.city, h.price, h.description, h.image, h.latitude, h.longitude, h.address
        ]);

        await connTarget.query(query, [values]);
        console.log(`Successfully transferred ${values.length} hotels.`);

    } catch (err) {
        console.error("Transfer failed:", err.message);
    } finally {
        if (connSource) await connSource.end();
        if (connTarget) await connTarget.end();
    }
}

transfer();
