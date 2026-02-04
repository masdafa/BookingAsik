import db from "../config/db.js";
import jwt from "jsonwebtoken";

// =========================
// REGISTER (Password Biasa)
// =========================
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password)
      return res
        .status(400)
        .json({ message: "Nama, email, dan password wajib diisi" });

    // Cek email sudah ada atau belum
    const [cek] = await db.query("SELECT id FROM users WHERE email = ?", [
      email,
    ]);

    if (cek.length > 0)
      return res.status(400).json({ message: "Email sudah terdaftar" });

    // INSERT password langsung (plaintext)
    await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, password, role || "user"]
    );

    res.json({ message: "Registrasi berhasil" });
  } catch (err) {
    console.error("registerUser Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// =========================
// LOGIN (Password Biasa)
// =========================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email dan password wajib diisi" });

    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    if (rows.length === 0)
      return res.status(401).json({ message: "Email atau password salah" });

    const user = rows[0];

    // PASSWORD TANPA HASH
    if (user.password !== password)
      return res.status(401).json({ message: "Email atau password salah" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "SECRET_KEY",
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("loginUser Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// =========================
// GET all users
// =========================
export const listUsers = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM users ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error("listUsers Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// =========================
// GET user by ID
// =========================
export const getUser = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [
      req.params.id,
    ]);

    if (rows.length === 0)
      return res.status(404).json({ message: "User tidak ditemukan" });

    res.json(rows[0]);
  } catch (err) {
    console.error("getUser Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// =========================
// UPDATE user
// =========================
export const updateUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const [result] = await db.query(
      "UPDATE users SET name=?, email=?, password=?, role=? WHERE id=?",
      [name, email, password, role, req.params.id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "User tidak ditemukan" });

    res.json({ message: "User berhasil diperbarui" });
  } catch (err) {
    console.error("updateUser Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// =========================
// DELETE user
// =========================
export const deleteUser = async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM users WHERE id=?", [
      req.params.id,
    ]);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "User tidak ditemukan" });

    res.json({ message: "User berhasil dihapus" });
  } catch (err) {
    console.error("deleteUser Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
