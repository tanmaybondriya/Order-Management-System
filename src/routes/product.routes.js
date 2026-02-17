import express from "express";

import {
  createProduct,
  getAllProduct,
} from "../controllers/product.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
const router = express.Router();

router.route("/").get(getAllProduct).post(authMiddleware, createProduct);

export default router;
