import express from "express";
import {
  verifyPayment,
  createPaymentOrder,
} from "../controllers/payment.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/create-order", authMiddleware, createPaymentOrder);
router.post("/verify", authMiddleware, verifyPayment);

export default router;
