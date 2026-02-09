import {
  createOrderController,
  orderHistortyController,
  cancelledOrderController,
} from "../controllers/order.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

import express from "express";

const router = express.Router();

router.post("/create-order", authMiddleware, createOrderController);
router.get("/order-history", authMiddleware, orderHistortyController);
router.patch(
  "/cancel-order/:orderId",
  authMiddleware,
  cancelledOrderController,
);
export default router;
