import express from "express";
import {
  listUsers,
  getUser,
  updateUser,
  deleteUser
} from "../controllers/user.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";

const r = express.Router();

// Semua rute hanya bisa diakses admin
r.use(requireAuth, requireRole("admin"));

r.get("/", listUsers);       // GET semua user
r.get("/:id", getUser);      // GET user by id
r.put("/:id", updateUser);   // UPDATE user
r.delete("/:id", deleteUser); // DELETE user

export default r;
