import express from "express";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.use("/auth", authRoutes);

// Protected routes - require authentication
router.use(auth);
router.use("/users", userRoutes);

export default router;