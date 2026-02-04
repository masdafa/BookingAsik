import pool from "./config/db.js";

const createAttractionsTables = async () => {
    const connection = await pool.getConnection();

    try {
        console.log("🚀 Starting attractions tables migration...");

        // Create attractions table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS attractions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        city VARCHAR(100) NOT NULL,
        price DECIMAL(12, 2) NOT NULL,
        description TEXT,
        image VARCHAR(500),
        category VARCHAR(50) DEFAULT 'nature',
        duration VARCHAR(50) DEFAULT '2-3 hours',
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        address VARCHAR(500),
        rating DECIMAL(2, 1) DEFAULT 4.5,
        amenities JSON,
        opening_hours VARCHAR(100) DEFAULT '08:00 - 17:00',
        is_flash_sale BOOLEAN DEFAULT FALSE,
        discount_percent INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
        console.log("✅ attractions table created");

        // Create attraction_bookings table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS attraction_bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        attraction_id INT NOT NULL,
        visit_date DATE NOT NULL,
        tickets INT NOT NULL DEFAULT 1,
        total_price DECIMAL(12, 2) NOT NULL,
        status VARCHAR(20) DEFAULT 'confirmed',
        payment_method VARCHAR(50),
        points_earned INT DEFAULT 0,
        guest_name VARCHAR(100),
        guest_email VARCHAR(100),
        guest_phone VARCHAR(20),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (attraction_id) REFERENCES attractions(id) ON DELETE CASCADE
      )
    `);
        console.log("✅ attraction_bookings table created");

        console.log("🎉 All attractions tables created successfully!");

    } catch (error) {
        console.error("❌ Migration error:", error);
        throw error;
    } finally {
        connection.release();
    }
};

// Run migration
createAttractionsTables()
    .then(() => {
        console.log("Migration completed!");
        process.exit(0);
    })
    .catch((err) => {
        console.error("Migration failed:", err);
        process.exit(1);
    });
