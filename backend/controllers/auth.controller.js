// src/controllers/auth.controller.js

import db from "../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; // 🚨 PASTIKAN MENGIMPOR BCrypt

// Fungsi helper untuk generate JWT
const generateToken = (id) => {
    // Gunakan secret key dari environment atau default
    return jwt.sign({ id }, process.env.JWT_SECRET || "SECRET_KEY", {
        expiresIn: "30d",
    });
};

export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    // 1. Validasi Input Dasar
    if (!name || !email || !password) {
        return res.status(400).json({ message: "Mohon isi semua field" });
    }

    try {
        // 2. Cek User Exist (Wajib menggunakan await)
        const [existingUsers] = await db.query("SELECT id FROM users WHERE email = ? LIMIT 1", [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: "Email sudah terdaftar" });
        }

        // 3. HASH PASSWORD (Wajib menggunakan await pada genSalt dan hash)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt); // 🚨 FIX: Memastikan await digunakan

        // 4. INSERT KE DATABASE (Wajib menggunakan await)
        const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'user')";
        const [result] = await db.query(sql, [name, email, hashedPassword]); // 🚨 FIX: Memastikan await digunakan

        const userId = result.insertId;

        // 5. RESPON SUKSES
        res.status(201).json({
            id: userId,
            name,
            email,
            role: 'user',
            token: generateToken(userId),
        });

    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Server error during registration" });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Ambil User dari DB (Wajib menggunakan await)
        const [rows] = await db.query("SELECT id, name, email, password, role, points FROM users WHERE email = ? LIMIT 1", [email]); // 🚨 FIX: Memastikan await digunakan
        const user = rows[0];

        if (user && (await bcrypt.compare(password, user.password))) { // 🚨 FIX: Wajib menggunakan await pada compare

            // Login Berhasil
            res.status(200).json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                points: user.points,
                token: generateToken(user.id),
            });
        } else {
            // Login Gagal
            res.status(401).json({ message: "Email atau password salah" });
        }

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error during login" });
    }
};


// KONTROLER BARU: Mengambil data user yang sudah terotentikasi
export const getMe = (req, res) => {
    // Memastikan middleware sudah berjalan dan melampirkan user
    if (!req.user) {
        // Ini seharusnya tidak terjangkau jika middleware requireAuth benar
        return res.status(401).json({ message: "User not authenticated by middleware" });
    }

    // Kirim kembali data user yang dibutuhkan oleh frontend
    res.status(200).json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        points: req.user.points
    });
};