import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const config = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: "hotel_app" // Main DB
};

async function migrate() {
    let connection;
    try {
        connection = await mysql.createConnection(config);
        console.log("Connected to hotel_app.");

        // 1. Create Vouchers Table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS vouchers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        description VARCHAR(255),
        discount_amount INT NOT NULL,
        points_cost INT NOT NULL,
        image VARCHAR(255)
      )
    `);
        console.log("Vouchers table created.");

        // 2. Create User Vouchers Table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS user_vouchers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        voucher_id INT NOT NULL,
        is_used BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (voucher_id) REFERENCES vouchers(id) ON DELETE CASCADE
      )
    `);
        console.log("User Vouchers table created.");

        // 3. Seed Initial Vouchers
        const vouchers = [
            { code: "DISKON10K", description: "Potongan Rp 10.000", discount: 10000, cost: 100, image: "voucher10k.png" },
            { code: "DISKON50K", description: "Potongan Rp 50.000", discount: 50000, cost: 450, image: "voucher50k.png" }, // Sedikit diskon poin
            { code: "DISKON100K", description: "Potongan Rp 100.000", discount: 100000, cost: 900, image: "voucher100k.png" }
        ];

        for (const v of vouchers) {
            // Insert if not exists (check by code)
            const [exists] = await connection.query("SELECT id FROM vouchers WHERE code = ?", [v.code]);
            if (exists.length === 0) {
                await connection.query(
                    "INSERT INTO vouchers (code, description, discount_amount, points_cost, image) VALUES (?, ?, ?, ?, ?)",
                    [v.code, v.description, v.discount, v.cost, v.image]
                );
                console.log(`Seeded voucher: ${v.code}`);
            }
        }

    } catch (err) {
        console.error("Migration failed:", err);
    } finally {
        if (connection) await connection.end();
    }
}

migrate();
