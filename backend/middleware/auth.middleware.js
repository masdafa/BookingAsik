// src/middleware/auth.middleware.js

import jwt from "jsonwebtoken";
// Pastikan path ke db.js sudah benar
import db from "../config/db.js";

// 1. requireAuth: Middleware untuk memverifikasi token JWT dan mengotentikasi user.
// Fungsi ini akan dijalankan di rute yang memerlukan login (misal: /profile, /hotel, dll.)
export const requireAuth = async (req, res, next) => {
    let token;

    // Cek di header Authorization: Bearer <token>
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            // Ambil token (hapus 'Bearer ')
            token = req.headers.authorization.split(" ")[1];

            // Verifikasi token menggunakan secret key Anda
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET || "SECRET_KEY" // Gunakan secret key yang sama seperti saat login
            );

            // Cari user di database berdasarkan ID dari token
            const [rows] = await db.query(
                "SELECT id, name, email, role, points FROM users WHERE id = ? LIMIT 1",
                [decoded.id]
            );

            if (rows.length === 0) {
                // Token valid, tapi user tidak ditemukan di DB
                return res.status(401).json({ message: "User tidak ditemukan" });
            }

            // Lampirkan data user ke request object (req.user)
            req.user = rows[0];

            next(); // Lanjutkan ke middleware berikutnya atau controller
        } catch (error) {
            console.error("JWT Verification Error:", error);
            // Jika token kadaluarsa atau tidak valid, kirim 401
            return res.status(401).json({ message: "Token tidak valid atau kadaluarsa" });
        }
    }

    if (!token) {
        // Jika token tidak ditemukan sama sekali
        return res.status(401).json({ message: "Akses ditolak. Tidak ada token otorisasi." });
    }
};

// 2. requireRole: Middleware untuk memeriksa peran user (ROLE)
// Fungsi ini dipanggil setelah requireAuth berhasil. Contoh: requireRole("admin")
export const requireRole = (requiredRole) => (req, res, next) => {
    // req.user harus ada karena requireAuth sudah dijalankan
    if (!req.user || !req.user.role) {
        // Ini adalah fallback, seharusnya tidak terjadi jika requireAuth sukses
        return res.status(403).json({ message: "Akses ditolak. Informasi user tidak lengkap." });
    }

    // Cek apakah peran user (req.user.role) sesuai dengan peran yang dibutuhkan
    if (req.user.role !== requiredRole) {
        return res.status(403).json({
            message: `Akses ditolak. Hanya pengguna dengan peran ${requiredRole} yang diizinkan.`
        });
    }

    next(); // Lanjutkan ke controller
};