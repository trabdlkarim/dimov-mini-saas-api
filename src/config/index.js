import dotenv from "dotenv";
import supabase from "./supabase.js";
import { swaggerUi, specs } from "./swagger.js";

const config = {
  // Server settings
  port: parseInt(process.env.SERVER_PORT, 10) || 5000,
  env: process.env.NODE_ENV || "development",
  jwt: { secret: process.env.JWT_SECRET, expires: process.env.JWT_EXPIRES_IN || "7d"},
  supabase: supabase,
  swagger: { swaggerUi, specs },

  // CORS settings
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  },
};

export default config;
