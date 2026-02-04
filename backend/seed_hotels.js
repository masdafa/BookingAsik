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

const hotels = [
    {
        name: "Grand Indonesia Kempinski",
        city: "Jakarta",
        price: 2500000,
        description: "Luxury hotel in the heart of Jakarta.",
        image: "hotel1.jpg",
        latitude: -6.1953, // Approx lat
        longitude: 106.8230 // Approx long
    },
    {
        name: "Padma Hotel Bandung",
        city: "Bandung",
        price: 1800000,
        description: "Beautiful mountain view hotel.",
        image: "hotel2.jpg",
        latitude: -6.8732,
        longitude: 107.6044
    },
    {
        name: "Ayana Resort Bali",
        city: "Bali",
        price: 4500000,
        description: "World-class resort with stunning ocean views.",
        image: "hotel3.jpg",
        latitude: -8.7833,
        longitude: 115.1433
    },
    {
        name: "Phoenix Hotel Yogyakarta",
        city: "Yogyakarta",
        price: 900000,
        description: "Heritage hotel with colonial charm.",
        image: "hotel4.jpg",
        latitude: -7.7828,
        longitude: 110.3608
    },
    {
        name: "JW Marriott Surabaya",
        city: "Surabaya",
        price: 1500000,
        description: "5-star luxury in Surabaya city center.",
        image: "hotel5.jpg",
        latitude: -7.2654,
        longitude: 112.7416
    }
];

async function seed() {
    console.log("Seeding Hotels...");
    let connection;
    try {
        connection = await mysql.createConnection(config);
        console.log("Connected.");

        // Check if empty
        const [rows] = await connection.query("SELECT COUNT(*) as count FROM hotels");
        if (rows[0].count > 0) {
            console.log("Hotels table not empty. Skipping seed.");
            return;
        }

        const query = "INSERT INTO hotels (name, city, price, description, image, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?)";

        for (const h of hotels) {
            await connection.query(query, [h.name, h.city, h.price, h.description, h.image, h.latitude, h.longitude]);
            console.log(`Inserted: ${h.name}`);
        }
        console.log("Seeding Complete.");

    } catch (err) {
        console.error("Seed failed:", err.message);
    } finally {
        if (connection) await connection.end();
    }
}

seed();
