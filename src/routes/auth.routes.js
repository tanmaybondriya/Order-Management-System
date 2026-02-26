import express from "express";
import {
  register,
  login,
  getCurrentUser,
} from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { registerSchema, loginSchema } from "../validators/auth.validators.js";
import { validate } from "../middlewares/validate.middleware.js";
import { limiter } from "../middlewares/rateLimiter.middleware.js";
const router = express.Router();

router.post("/register", limiter, validate(registerSchema), register);
router.post("/login", limiter, validate(loginSchema), login);
router.get("/me", authMiddleware, getCurrentUser);

export default router;
