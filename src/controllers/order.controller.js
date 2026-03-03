import {
  createOrderWithTransaction,
  getOrderHistory,
  cancelledOrder,
  deleteOrder,
  updateOrderService,
} from "../services/order.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import { io } from "../server.js";

export const createOrderController = async (req, res, next) => {
  try {
    const order = await createOrderWithTransaction({
      userId: req.user.id,
      productId: req.body.productId,
      quantity: req.body.quantity,
    });

    res
      .status(201)
      .json(new ApiResponse(201, "Order Placed Successfully", order));
  } catch (error) {
    next(error);
  }
};

export const orderHistortyController = async (req, res, next) => {
  try {
    const orderhistory = await getOrderHistory({
      userId: req.user.id,
      status: req.query.status,
    });

    res
      .status(201)
      .json(
        new ApiResponse(201, "Order history fetched succesfully", orderhistory),
      );
  } catch (error) {
    next(error);
  }
};

export const cancelledOrderController = async (req, res, next) => {
  try {
    const order = await cancelledOrder({
      userId: req.user.id,
      orderId: req.params.orderId,
    });

    res
      .status(201)
      .json(new ApiResponse(201, "Order cancelled succesfully", order));
  } catch (error) {
    next(error);
  }
};

export const deletedOrderController = async (req, res, next) => {
  try {
    const order = await deleteOrder({
      userId: req.user.id,
    });

    res
      .status(201)
      .json(
        new ApiResponse(201, "Cancelled Orders deleted succesfully", order),
      );
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatusController = async (req, res, next) => {
  try {
    const { orderId } = req.params; // from url
    const { status } = req.body; // new status from new body
    const order = await updateOrderService({ orderId, status });

    //emit realtime event to the specific user's room
    io.to(order.user.toString()).emit("orderStatusUpdated", {
      orderId: order._id,
      status: order.status,
    });

    res.status(200).json(new ApiResponse(200, "Order status updated", order));
  } catch (error) {
    next(error);
  }
};
