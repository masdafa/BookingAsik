import pool from "./config/db.js";

const attractions = [
    // BALI
    {
        name: "Tanah Lot Temple",
        city: "Bali",
        price: 150000,
        description: "Pura ikonik yang berdiri di atas batu karang di tengah laut. Salah satu destinasi paling terkenal di Bali dengan pemandangan matahari terbenam yang spektakuler. Tempat suci ini memiliki arsitektur tradisional Bali yang memukau dan dikelilingi pemandangan ombak yang menghantam karang.",
        image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
        category: "temple",
        duration: "2-3 jam",
        latitude: -8.6213,
        longitude: 115.0868,
        address: "Beraban, Kediri, Tabanan, Bali",
        rating: 4.7,
        amenities: JSON.stringify(["Parking", "Restaurant", "Souvenir Shop", "Guide Available", "Photo Spot"]),
        opening_hours: "07:00 - 19:00",
        is_flash_sale: true,
        discount_percent: 20
    },
    {
        name: "Tegallalang Rice Terrace",
        city: "Bali",
        price: 80000,
        description: "Sawah berundak dengan pemandangan spektakuler di Ubud. Nikmati keindahan sistem irigasi tradisional subak yang telah menjadi warisan budaya UNESCO. Lokasi sempurna untuk foto Instagram dan merasakan ketenangan pedesaan Bali.",
        image: "https://images.unsplash.com/photo-1531592937781-344ad608fabf?auto=format&fit=crop&w=800&q=80",
        category: "nature",
        duration: "1-2 jam",
        latitude: -8.4312,
        longitude: 115.2793,
        address: "Tegallalang, Gianyar, Bali",
        rating: 4.6,
        amenities: JSON.stringify(["Swing", "Cafe", "Photo Spot", "Walking Trail", "Souvenir Shop"]),
        opening_hours: "08:00 - 18:00",
        is_flash_sale: false,
        discount_percent: 0
    },
    {
        name: "Uluwatu Temple",
        city: "Bali",
        price: 100000,
        description: "Pura megah di tebing tinggi dengan pemandangan Samudra Hindia. Saksikan pertunjukan tari Kecak yang memukau saat matahari terbenam. Hati-hati dengan monyet yang berkeliaran di area pura!",
        image: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=800&q=80",
        category: "temple",
        duration: "3-4 jam",
        latitude: -8.8291,
        longitude: 115.0849,
        address: "Pecatu, Kuta Selatan, Badung, Bali",
        rating: 4.8,
        amenities: JSON.stringify(["Kecak Dance Show", "Parking", "Photo Spot", "Cafe", "Guide Available"]),
        opening_hours: "09:00 - 19:00",
        is_flash_sale: true,
        discount_percent: 15
    },

    // YOGYAKARTA
    {
        name: "Borobudur Temple",
        city: "Yogyakarta",
        price: 350000,
        description: "Candi Buddha terbesar di dunia dan Situs Warisan Dunia UNESCO. Dibangun pada abad ke-9, candi ini memiliki lebih dari 500 patung Buddha dan 2.672 panel relief yang menceritakan ajaran Buddha. Sunrise tour sangat direkomendasikan!",
        image: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=800&q=80",
        category: "heritage",
        duration: "3-4 jam",
        latitude: -7.6079,
        longitude: 110.2038,
        address: "Borobudur, Magelang, Jawa Tengah",
        rating: 4.9,
        amenities: JSON.stringify(["Sunrise Tour", "Museum", "Elephant Ride", "Guide Available", "Restaurant", "Parking"]),
        opening_hours: "06:00 - 17:00",
        is_flash_sale: false,
        discount_percent: 0
    },
    {
        name: "Prambanan Temple",
        city: "Yogyakarta",
        price: 250000,
        description: "Kompleks candi Hindu terbesar di Indonesia, juga merupakan Situs Warisan Dunia UNESCO. Candi utama didedikasikan untuk Trimurti: Brahma, Wisnu, dan Siwa. Saksikan pertunjukan Ramayana Ballet di malam hari!",
        image: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80",
        category: "heritage",
        duration: "2-3 jam",
        latitude: -7.7520,
        longitude: 110.4914,
        address: "Prambanan, Sleman, Yogyakarta",
        rating: 4.8,
        amenities: JSON.stringify(["Ramayana Ballet", "Museum", "Guide Available", "Restaurant", "Parking", "Souvenir Shop"]),
        opening_hours: "06:00 - 17:00",
        is_flash_sale: true,
        discount_percent: 10
    },
    {
        name: "Malioboro Street",
        city: "Yogyakarta",
        price: 0,
        description: "Jalan legendaris di jantung kota Yogyakarta. Surga belanja oleh-oleh, kuliner khas Jogja, dan kehidupan malam yang ramai. Temukan batik, kerajinan perak, dan gudeg lezat di sini!",
        image: "https://images.unsplash.com/photo-1584810359583-96fc3448beaa?auto=format&fit=crop&w=800&q=80",
        category: "culture",
        duration: "2-4 jam",
        latitude: -7.7930,
        longitude: 110.3659,
        address: "Jl. Malioboro, Yogyakarta",
        rating: 4.5,
        amenities: JSON.stringify(["Shopping", "Street Food", "Becak Ride", "Live Music", "Night Market"]),
        opening_hours: "24 jam",
        is_flash_sale: false,
        discount_percent: 0
    },

    // JAKARTA
    {
        name: "Monas (National Monument)",
        city: "Jakarta",
        price: 75000,
        description: "Monumen ikonik setinggi 132 meter yang menjadi simbol kemerdekaan Indonesia. Naik ke puncak untuk menikmati pemandangan 360 derajat kota Jakarta. Museum di dasar monumen menyimpan sejarah perjuangan bangsa.",
        image: "https://images.unsplash.com/photo-1555899434-94d1368aa7af?auto=format&fit=crop&w=800&q=80",
        category: "landmark",
        duration: "1-2 jam",
        latitude: -6.1754,
        longitude: 106.8272,
        address: "Gambir, Jakarta Pusat",
        rating: 4.4,
        amenities: JSON.stringify(["Observation Deck", "Museum", "Park", "Food Court", "Parking"]),
        opening_hours: "08:00 - 22:00",
        is_flash_sale: false,
        discount_percent: 0
    },
    {
        name: "Ancol Dreamland",
        city: "Jakarta",
        price: 200000,
        description: "Taman rekreasi terbesar di Jakarta dengan berbagai wahana seru. Nikmati Dufan, Sea World, Atlantis Water Adventure, dan pantai. Destinasi liburan keluarga yang lengkap!",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
        category: "theme_park",
        duration: "Full day",
        latitude: -6.1249,
        longitude: 106.8309,
        address: "Ancol, Jakarta Utara",
        rating: 4.3,
        amenities: JSON.stringify(["Theme Park", "Water Park", "Aquarium", "Beach", "Hotels", "Restaurants"]),
        opening_hours: "06:00 - 21:00",
        is_flash_sale: true,
        discount_percent: 25
    },

    // BANDUNG
    {
        name: "Kawah Putih",
        city: "Bandung",
        price: 100000,
        description: "Danau vulkanik dengan air berwarna putih kehijauan yang menakjubkan. Terletak di ketinggian 2.430 mdpl dengan udara yang sejuk. Pemandangan mistis yang sempurna untuk fotografi!",
        image: "https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=800&q=80",
        category: "nature",
        duration: "2-3 jam",
        latitude: -7.1660,
        longitude: 107.4021,
        address: "Ciwidey, Bandung, Jawa Barat",
        rating: 4.6,
        amenities: JSON.stringify(["Photo Spot", "Cafe", "Parking", "Mask Rental", "Souvenir Shop"]),
        opening_hours: "07:00 - 17:00",
        is_flash_sale: false,
        discount_percent: 0
    },
    {
        name: "Tangkuban Perahu",
        city: "Bandung",
        price: 90000,
        description: "Gunung berapi aktif dengan kawah yang bisa dikunjungi. Legenda Sangkuriang membuat tempat ini semakin menarik. Nikmati pemandangan kawah dan beli telur rebus yang dimasak uap vulkanik!",
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
        category: "nature",
        duration: "2-3 jam",
        latitude: -6.7596,
        longitude: 107.6097,
        address: "Lembang, Bandung Barat, Jawa Barat",
        rating: 4.5,
        amenities: JSON.stringify(["Crater View", "Horse Riding", "Souvenir Shop", "Food Stalls", "Parking"]),
        opening_hours: "08:00 - 17:00",
        is_flash_sale: false,
        discount_percent: 0
    },

    // LOMBOK
    {
        name: "Gili Islands",
        city: "Lombok",
        price: 500000,
        description: "Tiga pulau tropis surga dengan pantai pasir putih dan air jernih: Gili Trawangan (party island), Gili Air (relax), dan Gili Meno (romantic). Snorkeling, diving, dan sunset yang memukau!",
        image: "https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?auto=format&fit=crop&w=800&q=80",
        category: "beach",
        duration: "Full day",
        latitude: -8.3508,
        longitude: 116.0346,
        address: "Gili Islands, Lombok Utara, NTB",
        rating: 4.8,
        amenities: JSON.stringify(["Snorkeling", "Diving", "Beach", "Sunset View", "No Motorized Vehicles", "Glass Bottom Boat"]),
        opening_hours: "24 jam",
        is_flash_sale: true,
        discount_percent: 15
    },
    {
        name: "Mount Rinjani",
        city: "Lombok",
        price: 1500000,
        description: "Gunung tertinggi kedua di Indonesia dengan kawah danau Segara Anak yang memukau. Trekking 2-4 hari untuk pendaki berpengalaman. Sunrise di puncak adalah pengalaman tak terlupakan!",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
        category: "adventure",
        duration: "2-4 hari",
        latitude: -8.4108,
        longitude: 116.4573,
        address: "Taman Nasional Gunung Rinjani, Lombok, NTB",
        rating: 4.9,
        amenities: JSON.stringify(["Trekking", "Camping", "Hot Springs", "Crater Lake", "Porter Service", "Guide Required"]),
        opening_hours: "24 jam (perlu izin)",
        is_flash_sale: false,
        discount_percent: 0
    }
];

const seedAttractions = async () => {
    const connection = await pool.getConnection();

    try {
        console.log("🚀 Starting attractions seeding...");

        // Check if attractions already exist
        const [existing] = await connection.query("SELECT COUNT(*) as count FROM attractions");
        if (existing[0].count > 0) {
            console.log(`⚠️ Found ${existing[0].count} existing attractions. Skipping seed.`);
            console.log("   To reseed, delete existing data first.");
            return;
        }

        // Insert attractions
        for (const attraction of attractions) {
            await connection.query(
                `INSERT INTO attractions 
        (name, city, price, description, image, category, duration, latitude, longitude, address, rating, amenities, opening_hours, is_flash_sale, discount_percent) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    attraction.name,
                    attraction.city,
                    attraction.price,
                    attraction.description,
                    attraction.image,
                    attraction.category,
                    attraction.duration,
                    attraction.latitude,
                    attraction.longitude,
                    attraction.address,
                    attraction.rating,
                    attraction.amenities,
                    attraction.opening_hours,
                    attraction.is_flash_sale,
                    attraction.discount_percent
                ]
            );
            console.log(`✅ Added: ${attraction.name}`);
        }

        console.log(`\n🎉 Successfully seeded ${attractions.length} attractions!`);

    } catch (error) {
        console.error("❌ Seeding error:", error);
        throw error;
    } finally {
        connection.release();
    }
};

// Run seeding
seedAttractions()
    .then(() => {
        console.log("Seeding completed!");
        process.exit(0);
    })
    .catch((err) => {
        console.error("Seeding failed:", err);
        process.exit(1);
    });
