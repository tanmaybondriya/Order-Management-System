import express from "express";

import {
  createProduct,
  getAllProduct,
} from "../controllers/product.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { authHandler } from "../middlewares/authRole.middleware.js";
const router = express.Router();

router
  .route("/")
  .get(getAllProduct)
  .post(authMiddleware, authHandler("admin"), createProduct);

export default router;
