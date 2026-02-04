// src/routes/auth.routes.js (REVISI FINAL)

import express from "express";
import { registerUser, loginUser, getMe } from "../controllers/auth.controller.js";
// 🚨 Ubah import dari 'protect' menjadi 'requireAuth'
import { requireAuth } from "../middleware/auth.middleware.js"; 

const r = express.Router();

r.post("/register", registerUser);
r.post("/login", loginUser);

// Gunakan requireAuth untuk melindungi rute /me
r.get("/me", requireAuth, getMe); 

export default r;