import {
  createOrder,
  getOrderHistory,
  cancelledOrder,
} from "../services/order.service.js";
import ApiResponse from "../utils/ApiResponse.js";
export const createOrderController = async (req, res, next) => {
  try {
    const order = await createOrder({
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
      userId: req.user.id, //6987927ad71165c02e72a4f2
      orderId: req.params.orderId, //6988fa92b92d1e9679340b6b
    });

    res
      .status(201)
      .json(new ApiResponse(201, "Order cancelled succesfully", order));
  } catch (error) {
    next(error);
  }
};
