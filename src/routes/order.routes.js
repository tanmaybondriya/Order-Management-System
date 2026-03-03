import {
  createOrderController,
  orderHistortyController,
  cancelledOrderController,
  deletedOrderController,
  updateOrderStatusController,
} from "../controllers/order.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

import express from "express";
import { authHandler } from "../middlewares/authRole.middleware.js";

const router = express.Router();

router.post("/create-order", authMiddleware, createOrderController);
router.get("/order-history", authMiddleware, orderHistortyController);
router.patch(
  "/cancel-order/:orderId",
  authMiddleware,
  cancelledOrderController,
);
router.delete("/delete-order", authMiddleware, deletedOrderController);
router.patch(
  "/update-status/:orderId",
  authMiddleware,
  authHandler("admin"), //checks if the user is admin or not
  updateOrderStatusController,
);
export default router;
