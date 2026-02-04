// src/utils/loyalty.js

// Rate: 1 Poin per Rp 10.000
const POINTS_RATE = 10000;

/**
 * Mengambil saldo poin dari user yang sedang login.
 * @param {string | number} userId ID pengguna yang login.
 * @returns {number} Saldo poin saat ini.
 */
export const getLoyaltyPoints = (userId) => {
    if (!userId) return 0;
    const allPoints = JSON.parse(localStorage.getItem("loyalty_points") || "{}");
    return allPoints[userId] || 0;
};

/**
 * Menambahkan poin ke saldo user setelah booking.
 * @param {string | number} userId ID pengguna yang login.
 * @param {number} amount Total harga booking.
 * @returns {number} Jumlah poin yang baru didapatkan.
 */
export const addLoyaltyPoints = (userId, amount) => {
    if (!userId || amount <= 0) return 0;

    const earnedPoints = Math.floor(amount / POINTS_RATE);

    if (earnedPoints <= 0) return 0;

    const allPoints = JSON.parse(localStorage.getItem("loyalty_points") || "{}");

    // Tambahkan poin ke saldo yang sudah ada
    allPoints[userId] = (allPoints[userId] || 0) + earnedPoints;

    localStorage.setItem("loyalty_points", JSON.stringify(allPoints));

    // Kirim event agar Navbar/komponen lain bisa update
    window.dispatchEvent(new CustomEvent('loyalty-updated', { detail: allPoints[userId] }));

    return earnedPoints;
};